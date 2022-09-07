const { capitalizeFirstLetter } = require('./utils');
const getResources = (factionData) => {

  let initialString = '';
  if (factionData.resources.list.length) {
  	initialString += `They have available to them: `
  }
  factionData.resources.list.map((x, idx) => {
    if (idx === factionData.resources.list.length - 1) {
      initialString += `and `;
    }
    initialString += `${x.amount} ${x.type}`;
	  if (idx === factionData.resources.list.length - 1) {
		  initialString += `. `;
	  }  else {
	  	initialString += ', '
	  }
  });
  initialString += `All of these resources are jealously guarded.`;
  return initialString;
};

const getMembers = (factionData, relations) => {
	const filtered = relations.filter(x => x.key === factionData.key);
	let initialString = ``;
	if (filtered && filtered.length) {
		initialString += `Current members include:[br]`
	}
  filtered.map(
    (r) => {
		initialString += `${relations[r.key].name} - ${capitalizeFirstLetter(r.relationship)}[br]`;
	}
  );
	return initialString;
};

const getLivery = (factionData) => {
  let returnString = '';
  if (factionData.livery) {
    if (factionData.livery.colours) {
      returnString += `They can be identified by the ${factionData.livery.colours.primary} and ${factionData.livery.colours.secondary} colors of their garments`;
    }
    if (factionData.livery.colours && factionData.livery.insignia) {
      returnString += `, and the ${factionData.livery.insignia} insignia they wear.`;
    } else {
      returnString += `They can be identified by the ${factionData.livery.insignia} insignia they wear.`;
    }
  } else {
    returnString += 'They have no distinguishing livery or markings';
  }
  return returnString;
};

function getLeader(factionData) {
	if (factionData.leader && factionData.leader.name) return `They are ruled by ${factionData.leader.name}, who was ${factionData.leaderQualification}`
	return '';
}
function getLeaderCompetence(factionData) {
	if (factionData.leader && factionData.leader.name) return `${
		factionData.leader.name
	} is ${factionData.leaderCompetence}. `;
	return '';
}
function displaySeededAlliesRivals(factionData, type) {
	let descriptionText = factionData[`${type}Description`];
	let initialString = `The ${factionData.wordNoun} has ${descriptionText}. `;
	if (factionData[type].length) {
		factionData[type].map((x, idx) => {
			if (factionData[type].length === 1) {
				initialString += `Chief among them is `;
			} else if (idx === factionData[type].length - 1) {
				initialString += `and `;
			} else if (idx === 0) {
				initialString += 'These include ';
			}
			initialString += x;
			if (idx === factionData[type].length - 1) {
				initialString += `. `;
			}  else {
				initialString += ', '
			}
		initialString += ''
	})
	}
	return initialString;
}

module.exports = {
  getResources,
  getMembers,
  getLivery,
	getLeader,
	getLeaderCompetence,
	displaySeededAlliesRivals
};
