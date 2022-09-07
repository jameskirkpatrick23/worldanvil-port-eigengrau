const { capitalizeFirstLetter } = require('../common/utils');

const calculateMainRace = (townDemographics) => {
	const values = Object.values(townDemographics) || [];
	const mainGroup = Math.max(...values);
	const mainIndex = Object.values(townDemographics).indexOf(mainGroup);
	return Object.keys(townDemographics)[mainIndex];
};

const WEALTH_TABLE = {
	95: 'kingly',
	80: 'aristocratic',
	70: 'wealthy',
	60: 'comfortable',
	50: 'modest',
	25: 'poor',
	15: 'squalid',
	0: 'destitute',
};

const rulerData = (town) => {
	if (!town.ruler) return '';
	return `${town.ruler.title} ${town.ruler.name} is the head of the state.`;
};

const getTownArcana = (town) => {
	const roll = town.roll.arcana;

	if (town.politicalIdeology === 'magocracy') {
		if (roll > 90)
			return `Magic is reserved for the ruling class of mages, who govern ${town.name}. Those found practicing magic without a license are considered to be undermining the council of wizards' authority.`;
		if (roll > 80)
			return `Magic is reserved only for the ruling class of mages and those who manage to procure a license, which is an intentionally confusing affair of different forms that need signatures from the council of wizards that govern ${town.name}.`;
		if (roll > 70)
			return `Magic is typically only for the ruling class of mages who govern ${town.name}. Those who cast spells within ${town.name} are seen as politicians more than awe-inspiring heroes.`;
		if (roll > 60)
			return `Magic is not codified into the laws, though the wizard council that governs ${town.name} have instructed the local guards would be more likely to treat it as a threat rather than not.`;
		if (roll > 50)
			return 'Magic has not been codified into the laws by the wizard council to keep the powers that allow them to rule to be open to all.';
		if (roll > 40)
			return `Magic is not codified into the laws as anything specific, though the wizard council that governs ${town.name} have instructed the local guards would be more likely to treat it as a threat rather than not.`;
		if (roll > 30)
			return `Magic is treated with suspicion, and the wizard council that governs ${town.name} treat anybody practicing magic as a threat to their rule.`;
		if (roll > 20)
			return `Magic is treated with suspicion and fear, and the people of ${town.name} trust only the wizard council with magic.`;
		if (roll > 10)
			return `Those that do not sit on the wizard council that governs ${town.name} are not permitted to cast magic. It is coded into law as a restricted activity.`;
		return `Magic is outlawed. Only the wizards that govern ${town.name} are permitted to cast any spells beyond a cantrip level.`;
	}
	if (roll > 90)
		return "Magic is reserved only for those with a license, which is a relatively simple form to fill out, stating what type of magic you wish to practice, your contact details, a non-refundable bond to cover public liability, and whether it's for commercial or personal use.";
	if (roll > 80)
		return "Magic is reserved only for those with a license, which is a relatively simple form to fill out, stating what type of magic you wish to practice, a public liability bond, and whether it's for commercial or personal use.";
	if (roll > 70)
		return 'Magic is typically reserved for those with a license. There is some magic, but is mostly for personal use, and sometimes commercial.';
	if (roll > 60)
		return 'Magic is not codified into the laws, though the local guards would be more likely to treat it as a threat rather than not.';
	if (roll > 50) return 'Magic has not been codified into the laws.';
	if (roll > 40)
		return 'Magic is not codified into the laws as anything specific, though the local guards would be more likely to treat it as a threat rather than not.';
	if (roll > 30)
		return 'Magic is treated with suspicion, and guards look for any excuse to put a magic user away behind bars.';
	if (roll > 20)
		return 'Magic is treated with extreme suspicion, and is coded into law as a restricted activity.';
	if (roll > 10)
		return 'Magic is reviled by the guards, and they look for any excuse to put away a magic user. It is coded into law as a restricted activity, so they have an easy time of doing it, too.';
	return 'Magic is outlawed, and guards look for any excuse to put away anyone that looks like a magic user. It is coded into law as a tightly restricted activity.';
};

const leaderData = (town) => {
	if (!town.leader) return '';
	return `Government affairs are handled by ${town.leader.title} ${town.leader.name}.`;
};

const getTownLaw = (town) => {
	const roll = town.roll.law;

	if (town.politicalIdeology === 'kleptocracy') {
		if (roll > 90)
			return `Law in ${town.name} is completely one sided. Those that breach the complex and codified list of laws and do not have the protection of the Thieves' Guild can expect hard labor, incarceration, or public execution. The Thieves' Guild controls the law, and have free reign as a result.`;
		if (roll > 80)
			return `Law in ${town.name} is totally one sided. Those that breach the complex list of laws and do not have the protection of the Thieves' Guild can expect hard labor, incarceration, or sometimes, even public execution. The Thieves' Guild controls the law, and have free reign as a result.`;
		if (roll > 70)
			return `Law in ${town.name} is very much in favour of the Thieves' Guild that runs the town. Their political power renders them virtually immune to the law, and criminals fear them more than the judicial system.`;
		if (roll > 60)
			return `Law in ${town.name} is in favour of the Thieves' Guild that runs the town. Their political power renders them largely above the law, and criminals fear them more than the judicial system.`;
		if (roll > 50)
			return `Law in ${town.name} is in favour of the Thieves' Guild that run the kleptocratic government. Their political power renders them mostly the law, and crime is rampant.`;
		if (roll > 40)
			return `Law in ${town.name} is slack, perhaps intentionally so- the Thieves' Guild that control the government would not be above bending the laws in their favour.`;
		if (roll > 30)
			return `Law in ${town.name} is quite slack as a result of a kleptocratic government. Those not aligned with the Thieves' Guild can expect harsh fines for crime.`;
		if (roll > 20)
			return `Law in ${town.name} is almost non existant for the members of the kleptocratic government that controls ${town.name}. For the common people, though, one can expect to lose a hand for stealing a loaf of bread without paying your Guild membership fees.`;
		return `Law in ${town.name} is basically non existant for the Thieves' Guild members that control the government. Common folk can lose a hand or their head for stealing a loaf of bread without paying their Guild membership fees, though.`;
	}
	if (roll > 90)
		return `Law in ${town.name} is overwhelmingly punitive, and those that breach the complex and codified list of laws can expect hard labor, incarceration, or public execution. Crime is seen as a stain, which cannot be erased, and only through retribution can it be redeemed.`;
	if (roll > 80)
		return `Law in ${town.name} is extremely punitive, and those that breach the complex list of laws can expect hard labor, incarceration, or sometimes public execution. Crime is an ugly stain on humanity, to be punished wherever possible.`;
	if (roll > 70)
		return `Law in ${town.name} is very much punitive based, and those that breach the laws can expect hard labor, incarceration, or sometimes public execution. Crime is an ugly stain on humanity, to be punished.`;
	if (roll > 60)
		return `Law in ${town.name} is punitive based, and those that breach the laws can expect hard labor, incarceration, fines, or, in some instances, public execution. Crime is an ugly stain on humanity, to be removed wherever possible.`;
	if (roll > 50)
		return `Law in ${town.name} is punitive, and those that breach the laws can expect hard labor, incarceration, fines, or, in rare instances, execution.`;
	if (roll > 40)
		return `Law in ${town.name} is somewhat reform-based, and those that breach the laws can expect hard labor, incarceration, or fines. The death penalty is typically reserved for traitors to the state.`;
	if (roll > 30)
		return `Law in ${town.name} is reform-based, and those that breach the laws can expect incarceration, fines, or going to an asylum for reform. The death penalty is reserved only for traitors to the state.`;
	if (roll > 20)
		return `Law in ${town.name} is reform-based, and those that breach the laws can expect incarceration, fines, asylums, or work-release programs to provide them with the chance to not become a recidivist. The death penalty is reserved only for traitors to the state.`;
	return `Law in ${town.name} is reform-based, and those that breach the laws can expect fines, penalties, or work-release programs to provide them with the best possible chance to not become a recidivist.`;
};

const getTownEconomics = (town) => {
	const wealth = town.roll.wealth;
	const townWealth = Object.keys(WEALTH_TABLE).findIndex((x) => x >= wealth) - 1;
	const usedWealthOutput = WEALTH_TABLE[townWealth] || WEALTH_TABLE[0];
	if (wealth > 90)
		return `Trade in ${
			town.name
		} is heavily regulated, with taxes, tariffs, and restrictions on what can be brought in and out of the ${
			town.type
		}, and people live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it. The trade guild strictly enforces the rules, and costs of doing business in ${
			town.name
		} are high.`;
	if (wealth > 80)
		return `Trade in ${
			town.name
		} is regulated, with taxes and restrictions on what can be brought in and out of the ${
			town.type
		}, and people live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it. The trade guild enforces rules, with stiff penalties and trade bans for rule-breakers.`;
	if (wealth > 70)
		return `Trade in ${
			town.name
		} is regulated, with taxes applied to all goods and services rendered, and people live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it. The trade guild enforces rules, with penalties for rule-breakers.`;
	if (wealth > 60)
		return `Trade in ${
			town.name
		} is mostly free, with some taxes applied to goods and services rendered in the city. People live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it.`;
	if (wealth > 50)
		return `Trade is reasonable in ${town.name}, and people live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it; some taxes are applied to certain goods and services that are rendered in the city.`;
	if (wealth > 40)
		return `Trade is reasonable in ${town.name}, and people live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it; some taxes are applied to certain goods and services that are rendered in the city, but the more creative entrepreneurs can find loopholes to make a better profit.`;
	if (wealth > 30)
		return `Trade is rather free in ${town.name}, and people live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it. There are few taxes, and there is little regulation from the authorities on what merchants can and cannot sell.`;
	if (wealth > 20)
		return `Trade is free in ${town.name}, and people live ${
			80 < wealth < 95 ? 'an' : 'a'
		} ${usedWealthOutput} existence because of it. There are no taxes or regulations to speak of.`;
	return `Caveat emptor is the guiding philosophy of ${town.name}, and people live ${
		80 < wealth < 95 ? 'an' : 'a'
	} ${usedWealthOutput} existence because of it. Without any taxes or regulations, the free market reigns supreme here.`;
};

const getTownWelfare = (town) => {
	const welfareRoll = town.roll.welfare;
	const wealthRoll = town.roll.wealth;
	const townWealth = Object.keys(WEALTH_TABLE).findIndex((x) => x >= wealthRoll) - 1;
	const usedWealthOutput = WEALTH_TABLE[townWealth] || WEALTH_TABLE[0];

	if (welfareRoll > 90 && wealthRoll > 50) {
		return 'Welfare is excellent. Citizens can expect free healthcare, education, child care, death services, safety nets, and other programs beneficial to the health of the public.';
	}
	if (welfareRoll > 90) {
		return `Welfare is as good as it possibly can be, given the wealth of ${town.name}. Citizens can expect healthcare, education, child care, and death services.`;
	}
	if (welfareRoll > 80 && wealthRoll > 50) {
		return 'Welfare is very good. Citizens can expect education, subsidised healthcare, death services, safety nets, and other programs beneficial to the health of the public.';
	}
	if (welfareRoll > 80) {
		return `Welfare is very good, considering the wealth of ${town.name}. Citizens can expect education, somewhat subsidised healthcare, death services, and other programs beneficial to the health of the public.`;
	}
	if (welfareRoll > 70 && wealthRoll > 50) {
		return 'Welfare is good. Citizens can expect death services, and other services such as healthcare and education, provided they are able to pay for it.';
	}
	if (welfareRoll > 70) {
		return 'Welfare is good, all things considered. Citizens can expect death services, and other services such as healthcare and education, provided they are able to pay for it.';
	}
	if (welfareRoll > 60 && wealthRoll > 40) {
		return `Welfare is above average, considering the ${usedWealthOutput} quality of life. Citizens can expect a decent education, provided they can pay for it. Healthcare is overtaxed and underfunded, though.`;
	}
	if (welfareRoll > 60) {
		return 'Welfare is above average. Citizens can expect a decent education, provided they can pay for it. Healthcare is overtaxed and underfunded.';
	}
	if (welfareRoll > 50) {
		return 'Welfare is average. Citizens can find an education, provided they can pay for it. Healthcare is overtaxed and underfunded, and the government hides behind layers of bureaucracy to dodge complaints.';
	}
	if (welfareRoll > 40) {
		return 'Welfare is below average. Citizens are largely left to their own fate except in extreme cases. Healthcare is neglected, and education is an afterthought. Most citizens would have better luck from private benefactors or the church than relying on the government.';
	}
	if (welfareRoll > 30) {
		return 'Welfare is bad. Citizens can expect the bare minimum of death services. Healthcare and education are fringe cases, and citizens would do better to seek a private benefactor than try and receive treatment from the government.';
	}
	if (welfareRoll > 20) {
		return "Welfare is terrible. Citizens can expect the absolute bare minimum of death services. Healthcare and education are ignored, and those unable to fend for themselves would go hungry if it weren't for private benefactors.";
	}
	return 'Welfare is non existent. Citizens can expect the absolute bare minimum of death services. Healthcare and education are totally ignored, and those unable to fend for themselves starve.';
};

function getPolice(factions) {
	return Object.values(factions).filter((faction) => faction.isPolicing)[0];
}

const getTownMilitary = (town) => {
	const police = getPolice(town.factions);
	const roll = town.roll.military;

	if (police && police.type === 'guards') {
		if (roll > 90)
			return `The guard is extremely strict, with citizens being forced to carry licenses, identification papers, and travel permits. The local guard, ${police.name}, is extremely well armed, and brutality is commonplace.`;
		if (roll > 80)
			return `The guards are very strict, with citizens being forced to carry licenses and travel permits. The local guard, ${police.name}, is well armed, and brutality is common.`;
		if (roll > 70)
			return `There is a strong policing presence, with citizens seeking to live in the city being forced to undergo background checks. The local guard, ${police.name}, is well armed, and brutality is not unheard of.`;
		if (roll > 60)
			return `There's a decent policing presence, and citizens know better than to step out of line, as ${police.name} are armed. Despite this, brutality is rare, and citizens with nothing to hide have nothing to fear.`;
		if (roll > 50)
			return `There is a policing presence in ${town.name}, but it is more for outside intruders rather than the population inside. Citizens are expected to follow the laws, and those that do have nothing to fear from ${police.name}.`;
		if (roll > 30)
			return `The policing presence in ${town.name} is more of a militia; some of the members of ${police.name} are part time, and there is little need for the use of force outside of intruders.`;
		if (roll > 20)
			return `The policing presence in ${town.name} is a militia; most of the guards of ${police.name} are part time, and there is little need for the use of force. Citizens act with honesty, and have no need for 24/7 guards.`;
		return `The policing presence in ${town.name} is a militia; the guards of ${police.name} are part time, and there is rarely any need for the use of force. Law breakers are judged by community tribunals.`;
	}
	if (roll > 90)
		return `The policing carried out by ${police ? police.name : 'the citizens'} is extremely strict, with citizens being forced to carry licenses, identification papers, and travel permits. ${police ? police.name : 'the citizens'} control the $town.type, and are extremely well armed, with brutality being commonplace.`;
	if (roll > 80)
		return `${police ? police.name : 'the citizens'} are very strict, with citizens being forced to carry licenses and travel permits. The law is enforced by ${police ? police.name : 'the citizens'}, who are well armed, and brutality is common.'`;
	if (roll > 70)
		return `There is a strong guard presence enacted by ${police ? police.name : 'the citizens'}, with citizens seeking to live in the city being forced to undergo background checks. ${police ? police.name : 'the citizens'} are well armed, and brutality is not unheard of.'`;
	if (roll > 60)
		return `There's a decent guard presence, and citizens know better than to step out of line, as ${police ? police.name : 'the citizens'} are armed. Despite this, brutality is rare, and citizens with nothing to hide have nothing to fear.`;
	if (roll > 50)
		return `There is a guard presence in ${town.name}, but it is more for outside intruders rather than the population inside. Citizens are expected to follow the laws, and those that do have nothing to fear from ${police ? police.name : 'the citizens'}, who take care of policing matters.`;
	if (roll > 40)
		return `The guard presence in ${town.name} is somewhat smaller than one would expect for its size, perhaps due in part because law enforcement is carried out by ${police ? police.name : 'the citizens'}, who are seen as friends and drinking buddies, rather than horrible tyrants.`;
	if (roll > 30)
		return `The guard presence in ${town.name} is small, and policing is carried out by ${police ? police.name : 'the citizens'}. There is usually little need for the use of force outside of intruders.`;
	if (roll > 20)
		return `The guard presence in ${town.name} is a militia; policing is carried out by ${police ? police.name : 'the citizens'}, and there is little need for the use of force. Citizens act with honesty, and have no need for 24/7 guards.`;
	return `The guard presence in ${town.name} is a militia; policing is carried out by ${police ? police.name : 'the citizens'}, and there is rarely any need for the use of force. Law breakers are judged by community tribunals.`;
};

const listRaces = (town) => {
	const alphabeticalTownKeys = Object.keys(town.demographicPercentile).sort();
	const returnStringArray = alphabeticalTownKeys.map(
		(key) => `${capitalizeFirstLetter(key)}: ${Math.floor(((town.demographicPercentile[key]/100) * town.population)/100)} [br]`,
	);
	return returnStringArray.join('');
};

const oxford = (arr, conjunction, ifempty) => {
	let l = arr.length;
	if (!l) return ifempty;
	if (l < 2) return arr[0];
	if (l < 3) return arr.join(` ${conjunction} `);
	arr = arr.slice();
	arr[l - 1] = `${conjunction} ${arr[l - 1]}`;
	return arr.join(', ');
};

const describeTownDefenses = (town) => {
	const defenseBuildings = town.buildings.filter((building) =>
		['castle', 'guardhouse'].includes(building.type),
	);
	const defenseStrings = `${getTownMilitary(town)}[br]`;
	const buildingStrings = defenseBuildings.map((building) => {
		if (building.type === 'castle') {
			return `[br]${building.name}, a ${building.type}. The ${building.wordNoun} was built because ${building.defense.reason}. The outer walls have ${building.defense.outerWalls}, while the inner walls have ${building.defense.innerWalls}. It's condition is ${building.condition}.[br]`;
		}
		return `[br]${building.name}. The ${building.wordNoun} is ${building.structure.descriptor}. ${building.tippyDescription}[br]`;
	});
	return `${defenseStrings}${buildingStrings.join('')}`;
};

const describeFactions = (factions) => {
	return Object.keys(factions).map(
		(key) => `[br]${factions[key].name}: ${factions[key].tippyDescription}[br]`,
	).join('');
};

const townData = ({ town, worldId }) => {
	const title = town.name;
	const generalText = `The ${town.type} of ${town.name}, located on the ${town.terrain} ${town.location} where the vegetation is ${town.vegetation}. ${town.name} grew around ${town.origin}.[br][br]The ${town.type} is also famous for ${town.landmark}`;

	const resourceText = `Primary Export: ${town.primaryExport}. Primary Crop: ${
		town.primaryCrop
	}. There are also resonable amounts of: ${oxford(town['possibleMaterials'], 'and', '')}`;

	const demographicsText = `${town.name} is comprised predominately of
  ${calculateMainRace(town.demographicPercentile)}s.[br] ${listRaces(town)}`;

	const defenseText = describeTownDefenses(town);

	const infrastructureText = `The town and buildings are primarily made from ${
		town.townMaterial
	}. ${getTownEconomics(town)} ${getTownWelfare(town)}`;

	const factionText = describeFactions(town.factions);

	const governmentText = `${town.tippy}. The ${
		town.type
	} is ${town.description.toLowerCase()} ${rulerData(
		town,
	)}${leaderData(town)}`;


	return {
		title,
		template: 'settlement',
		world: worldId,
		state: 'public',
		is_wip: false,
		is_draft: false,
		pronunciation: '',
		displaySidebar: false,
		userMetadata: {
			eigengrauId: town.key,
		},
		tags: `${town.name}, ${town.type}`,
		excerpt: generalText,
		content: `${generalText}.[br][br][br][h2]Government[/h2][hr][br]${governmentText}[br][h3]Economics[/h3][br]${infrastructureText}[br][h3]Law and Order[/h3][br]${getTownMilitary(
			town,
		)} ${getTownLaw(town)} ${getTownArcana(
			town,
		)}[br][br][br][h2]Racial Demographics[/h2][hr][br]${demographicsText}`,
		seeded: `[h2]Economics[/h2][hr][br]${resourceText}[br][br][br][h2]Factions[/h2][hr][br]${factionText}[br][br][br][h2]Defenses[/h2][hr][br]${defenseText}`,
	};
};

module.exports = {
	townData,
};
