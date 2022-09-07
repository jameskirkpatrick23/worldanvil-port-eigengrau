const { capitalizeFirstLetter } = require('../utils');

function findReciprocalRelationships(town, entity, npc, target) {
  if (!town) {
    console.error('Not enough parameters passed.');
  }

  let pool = [];
  switch (target) {
    case 'building':
      pool = town.buildingRelations;
      break;
    case 'faction':
      pool = town.factionRelations;
      break;
    default:
      pool = town.buildingRelations.concat(town.factionRelations);
  }
  const foundRelationships = pool.filter((relation) => {
    if (entity && npc) {
      return relation.otherKey === entity.key && relation.npcKey === npc.key;
    }
    if (entity) {
      return relation.otherKey === entity.key;
    }
    if (npc) {
      return relation.npcKey === npc.key;
    }
    return false;
  });

  return foundRelationships;
}

const getLifeEvents = (npc) => {
	if (!npc.lifeEvents.length) {
		return '';
	}
  if (npc.lifeEvents.length > 1) {
    return `When I was younger, ${npc.lifeEvents[0]} Later in my life, ${npc.lifeEvents[1]}`;
  }

  if (npc.lifeEvents.length === 1) {
    const otherOptions = [
      'Nothing else really would stand out',
      "I'm afraid that's all that would impress the likes of you",
      "I'm afraid that I've still got quite a ways to go in the ways of impressive tales, that's about it.",
      "And that's really honestly about it...",
      "Uh, that's really the only interesting story I have, to be honest.",
    ];
    const other = otherOptions[(otherOptions.length * Math.random()) | 0];
    return `This one time ${npc.lifeEvents[0]} ${other}`;
  }

  const first = npc.lifeEvents[0];
  const last = npc.lifeEvents[npc.lifeEvents.length - 1];

  const misc = npc.lifeEvents.slice(1, -1).reduce((total, lifeEvent) => {
    const options = [
      capitalizeFirstLetter(lifeEvent),
      capitalizeFirstLetter(lifeEvent),
      `How could I ever forget the time ${lifeEvent} `,
      `After that, ${lifeEvent}`,
      `Not to mention there was the time ${lifeEvent}`,
      `Oh, and I can't forget the time ${lifeEvent} `,
      `There was this one time, ${lifeEvent} `,
      `Once ${lifeEvent} `,
      `One time ${lifeEvent} `,
      `You might not believe it, but ${lifeEvent} `,
      `I forget exactly when, but at one point, ${lifeEvent} `,
      `At one point ${lifeEvent} `,
      `I'll always remember the time ${lifeEvent} `,
    ];
    return total + options[(options.length * Math.random()) | 0];
  }, '');
return `This one time ${first} ${misc} At one point, ${last}`;
};

const getVocalPattern = (npc) => {
  if (npc.vocalPattern) return `${capitalizeFirstLetter(npc.heshe)} ${npc.vocalPattern}.`;
  return '';
};

const showHomeRoad = (npc, town) => {
  if (npc.family && town.families[npc.family] && town.families[npc.family].home && town.families[npc.family].home.road && town.roads[town.families[npc.family].home.road]) {
    return `${capitalizeFirstLetter(npc.heshe)} lives on ${
      town.roads[town.families[npc.family].home.road]
    }`;
  }
  return '';
};

const showNPCLanguages = (npc) => {
  if (npc.knownLanguages.length > 1) {
    return `${npc.firstName} can speak and read: ${npc.knownLanguages.join(', ')}.`;
  }
  return '';
};

const showSexuality = (npc, npcs) => {
  let dataString = `${capitalizeFirstLetter(npc.heshe)} is ${npc.sexuality}`;
  if (npc.partnerId) {
    dataString += `, and has ${npcs[npc.partnerID].marriageNoun}, ${npcs[npc.partnerID].name}.`;
  }
  return dataString;
};

const showEarlyLife = (npc) => {
  let finalString = ``;
  if (npc.birthplace) finalString += `${npc.name} was born ${npc.birthplace}.`
	if (npc.familyUnit) finalString += `${capitalizeFirstLetter(npc.heshe)} was raised by ${npc.familyUnit}.`;
  if (npc.siblingNumber === 0 || !npc.siblingNumber) {
    finalString += `${capitalizeFirstLetter(npc.heshe)} is an only child.`;
  } else {
    finalString += `${capitalizeFirstLetter(npc.heshe)} was raised with ${npc.hisher} ${npc.siblingNumber} siblings.`;
  }
  if (npc.familyLifestyle && npc.familyHome) {
	  finalString += `${npc.name} had an ${npc.familyLifestyle} upbringing in ${npc.familyHome}.`;
  }
  if (!npc.knewParents) {
    finalString += " I didn't know my parents growing up.";
  }
  if (npc.parentalLineage) {
    finalString += `${npc.parentalLineage}.`;
  }
  if (npc.childhoodMemories) finalString += npc.childhoodMemories;
  return finalString;
};

const getNPCRelationships = (npc, npcs, town) => {
  const matchedRelationKeys = Object.keys(town.npcRelations).filter(
    (relationKey) => relationKey === npc.key,
  );
  let endData = ``;
  matchedRelationKeys.map((key) => {
    const current = town.npcRelations[key];
    if (current && npcs[current.targetNpcKey] && npcs[current.targetNpcKey].name) {
    	endData += `[br][h3]${npcs[current.targetNpcKey].name}:[/h3] ${current.relation}`;
	}
  });
  return endData;
};

const getBuildingRelationships = (npc, npcs, town) => {
  const buildingRelationships = findReciprocalRelationships(town, null, npc, 'building');
  let endData = ``;
  if (buildingRelationships.length) {
    buildingRelationships.map((buildingRelation) => {
      const currentBuilding = town.buildings.find((x) => x.key === buildingRelation.otherKey);
      endData += `[h3]${currentBuilding.name}:[/h3] ${capitalizeFirstLetter(
        buildingRelation.relationship,
      )} of the ${capitalizeFirstLetter(currentBuilding.wordNoun)}`;
    });
  }
  return endData;
};

const getFactionRelationships = (npc, npcs, town) => {
  const factionRelationships = findReciprocalRelationships(town, null, npc, 'faction');
  let endData = ``;
  if (factionRelationships.length) {
    factionRelationships.map((factionRelation) => {
      const currentFactionKey = Object.keys(town.factions).find((x) => x === factionRelation.key);
      const currentFaction = town.factions[currentFactionKey];
      if (currentFactionKey && currentFaction) {
		  endData += `[h3]${currentFaction.name}:[/h3] ${capitalizeFirstLetter(
			factionRelation.relationship,
		  )} of the ${capitalizeFirstLetter(currentBuilding.wordNoun)}`;
	  }
    });
  }
  return endData;
};

module.exports = {
  getVocalPattern,
  showHomeRoad,
  showNPCLanguages,
  showSexuality,
  showEarlyLife,
  getLifeEvents,
  getNPCRelationships,
  getBuildingRelationships,
  getFactionRelationships,
};
