const { dice } = require('../dice');
const { professions } = require('./professionData');
const {capitalizeFirstLetter} = require('../utils');

function breakGenderNorms(town) {
  if (town.ignoreGender) {
    return true;
  }
  return dice(2, 50) < clamp(town.roll.equality, 0, 100);
}

/**
 * Tests to see whether the supplied npc is of the dominant gender.
 */
function isDominantGender(town, npc) {
  return npc.gender === town.dominantGender;
}

function initSexistProfession(town, npc) {
  // if the profession is defined, but the gender isn't (which is quite common)
  if (npc.profession && !npc.gender) {
    // if the NPC *was* brave enough to break gender norms, then flag that
    if (breakGenderNorms(town)) {
      npc.gender = random(['man', 'woman']);
      // ...but the NPC is not brave enough to go against the grain
    } else {
      // then, take the gender from the profession
      const newGender = checkProfessionGender(town, npc);
      // if there's an associated gender, then that's assigned to the NPC
      if (newGender) {
        npc.gender = newGender;
      }
    }
  }
}

function isBreakingGenderNorms(town, npc) {
  return npc.gender !== checkProfessionGender(town, npc);
}

/**
 * Test for whether the profession is gendered.
 */
function checkProfessionGender(town, npc) {
  const profession = findProfession(town, npc);

  const subGender = town.dominantGender === 'woman' ? 'man' : 'woman';

  if (profession.domSub === 'dom' && isDominantGender(town, npc)) {
    return town.dominantGender;
  }

  if (profession.domSub === 'sub' && !isDominantGender(town, npc)) {
    return subGender;
  }
}

function findProfession(town, npc, professionName) {
  if (typeof professionName === 'undefined') {
    professionName = npc.profession || npc.dndClass;
  }

  if (!professionName && npc.socialClass) {
    professionName = fetchProfessionChance(town, npc);
  }

  if (!professionName) {
    return `Could not find profession ${professionName}.`;
  }

  const profession = professions[professionName];

  if (profession) {
    return profession;
  }

  const found = findInContainer(professions)('synonyms', professionName);

  if (typeof found === 'undefined') {
    return professions.peasant;
  }

  return found;
}

function returnGenderBreakingSection(town, npc) {
  if (isBreakingGenderNorms(town, npc) && npc.roll.professionLuck > 0) {
    return `Despite sexism against ${npc.himher}, has had success`;
  }
  if (isBreakingGenderNorms(town, npc) && npc.roll.professionLuck > 0) {
    return `Perhaps due to sexism, has had success`;
  }
	if (isBreakingGenderNorms(town, npc) && npc.roll.professionLuck < 0) {
		return `Despite sexism against ${npc.himher}, has had little success`;
	}
	if (isBreakingGenderNorms(town, npc) && npc.roll.professionLuck < 0) {
		return `Perhaps due to sexism, has had little success`;
	}
	return `${capitalizeFirstLetter(npc.heshe)} works`
}

module.exports = {
  returnGenderBreakingSection,
  findProfession,
};
