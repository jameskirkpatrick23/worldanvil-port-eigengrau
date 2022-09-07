const axios = require('axios');
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { townData } = require('../controllers/townMapper');
const { npcSeedData } = require('../controllers/npcMapper');
const { factionSeedData } = require('../controllers/factionMapper');
const { buildingSeedData } = require('../controllers/buildingMapper');


const manageUpsert = (matchedArray, deleteIds, config, baseUrl) => {
	if (matchedArray && matchedArray.length) {
		if (matchedArray.length > 1) {
			matchedArray.forEach((value, index) => {
				if (index !== matchedArray.length - 1) {
					deleteIds.push(value.id)
				}
			})
		} else {
			const current = matchedArray[0];
			config.method = 'patch';
			config.url = `${baseUrl}/${current.id}`
		}
	} else {
		config.method = 'post';
		config.url = baseUrl
	}
}

/* GET home page. */
router.get('/towns', cors(), async function(req, res, next) {
	const {worldId = '', applicationKey = '', authToken = ''} = req.params;
	const data = require('../towndata');
	// TODO FIND ALL ARTICLES, SORT THROUGH THEM BASED ON NAME OR METADATA
	const mappedTownData = townData({...data, worldId});
	var allArticleRequest = {
		method: 'get',
		url: `https://www.worldanvil.com/api/aragorn/world/${worldId}/articles`,
		headers: {
			'x-application-key': applicationKey,
			'x-auth-token': authToken,
			'Content-Type': 'application/json',
			'User-Agent': '$app_name ( $url, $version )',
			'Access-Control-Allow-Origin': '*',
		}
	};
	let allArticles = [];
	let currentOffset = 0;
	let currentSet = [];
	let buildingCount = 0;
	let peopleCount = 0;
	let factionCount = 0;
	let deleteCount = 0;

	do {
		allArticleRequest.url = `https://www.worldanvil.com/api/aragorn/world/${worldId}/articles?offset=${currentOffset}`;
		const responseData = await axios(allArticleRequest);
		currentSet = responseData.data.articles;
		allArticles = [...allArticles, ...currentSet];
		currentOffset += 50;
	} while(currentSet.length === 50);
	console.log('Total article count', allArticles.length);
	const baseUrl = 'https://www.worldanvil.com/api/aragorn/article';
	let config = {
		method: 'post',
		url: baseUrl,
		headers: {
			'x-application-key': {applicationKey},
			'x-auth-token': {authToken},
			'Content-Type': 'application/json',
			'User-Agent': '$app_name ( $url, $version )',
			'Access-Control-Allow-Origin': '*',
		},
		data: mappedTownData,
	};
		const promiseArray = [];
		const deleteIds = [];

		const townPromise = new Promise((res, rej) => {
			let matchedArray = allArticles.filter(x => x.title === mappedTownData.title)
			manageUpsert(matchedArray, deleteIds, config, baseUrl);
			axios(config).then(response => {
				res(response)
			}).catch(err => {
				console.log('what is my error town', [config.method, mappedTownData.title])

				rej(err)
			})
		});
		// // gather all npcs
		promiseArray.push(townPromise);
		Object.keys(data["npcs"]).map(npcKey => {
			const npcData = npcSeedData(data["npcs"][npcKey], data["town"]["npcRelations"], data["npcs"], data["town"], worldId);
			let matchedArray = allArticles.filter(x => x.title === npcData.title);
			manageUpsert(matchedArray, deleteIds, config, baseUrl);
			config.data = npcData;
			const npcPromise = new Promise((res, rej) => {
				axios(config).then(response => {
					res(response)
				}).catch(err => {
					console.log('what is my error npcs', [config.method, npcData.title])
					rej(err)
				})
			});
			peopleCount += 1;
			promiseArray.push(npcPromise);
		});
		// // // gather all factions
		Object.keys(data["town"]["factions"]).map(factionKey => {
			const factionData = factionSeedData(data["town"]["factions"][factionKey], data["npcs"], data["town"], worldId);
			let matchedArray = allArticles.filter(x => x.title === factionData.title);
			manageUpsert(matchedArray, deleteIds, config, baseUrl);
			config.data = factionData;
			const factionPromise = new Promise((res, rej) => {
				axios(config).then(response => {
					res(response)
				}).catch(err => {
					console.log('what is my error factions', [config.method, factionData.title])

					rej(err)
				})
			});
			factionCount += 1;
			promiseArray.push(factionPromise);
		});
		// // gather all buildings
		data["town"]["buildings"].map(building => {
			const buildingData = buildingSeedData(building, data["npcs"], data["town"], worldId);
			let matchedArray = allArticles.filter(x => x.title === buildingData.title);
			manageUpsert(matchedArray, deleteIds, config, baseUrl);
			config.data = buildingData;
			const buildingPromise = new Promise((res, rej) => {
				axios(config).then(response => {
					res(response)
				}).catch(err => {
					console.log('what is my error buildings', [config.method, buildingData.title])
					rej(err)
				})
			});
			buildingCount += 1;
			promiseArray.push(buildingPromise);
		});
		const uniqDeletableIds = [...new Set(deleteIds)];
		uniqDeletableIds.map(x => {
			config.method = 'delete';
			config.url = `${baseUrl}/${x}`;
			console.log('what is going on here', x)
			const deletePromise = new Promise((res, rej) => {
				axios(config).then(response => {
					res(response)
				}).catch(err => {
					console.log('what is my error?? delete')
					rej(err)
				})
			});
			deleteCount += 1;
			promiseArray.push(deletePromise)
		});
		Promise.all(promiseArray).then(x => {
			res.send({ initialArticleCount: allArticles.length, deleteCount, peopleCount, buildingCount, factionCount })
		}).catch(err => res.send(err))
	// res.render('index', { title: 'Express' });
});



module.exports = router;
