const {
  getVocalPattern,
  showHomeRoad,
  showNPCLanguages,
  showSexuality,
  showEarlyLife,
  getLifeEvents,
  getNPCRelationships,
  getBuildingRelationships,
  getFactionRelationships,
} = require('../common/npcs/npcUtils');
const { getTraitsReadout } = require('../common/npcs/traitUtils');
const {
  showNetIncome,
  money,
  npcGrossIncome,
  npcTaxRate,
  npcNetIncome,
  npcLifestyleStandard,
  npcTotalLifestyleExpenses,
  npcProfit,
  showCreditors,
  showDebtors,
} = require('../common/npcs/financeUtils');
const { showSocialClass, showBeard, showWeapon } = require('../common/npcs/socialUtils');
const { returnGenderBreakingSection } = require('../common/npcs/professionUtils');
const { capitalizeFirstLetter } = require('../common/utils');

const npcSeedData = (npcData, relations, npcs, town, worldId) => ({
  // id: 'bff007dc-6362-4442-abfd-1fe1a2fab53d',
  title: `${npcData.name}`,
  subheading: `${capitalizeFirstLetter(npcData.profession)} of ${town.name}`,
  template: 'person',
  is_wip: false,
  is_draft: false,
  world: worldId,
  state: 'public',
  tags: `${town.name}, ${npcData.lastName}, ${npcData.profession}`,
  pronunciation: '',
  displaySidebar: false,
  userMetadata: {
    eigengrauId: npcData.key,
  },
  excerpt: `${npcData.name} is an ${npcData.ageStage} ${npcData.race}. ${capitalizeFirstLetter(
    npcData.heshe,
  )} is ${npcData.descriptor} with ${npcData.hair} and ${npcData.eyes} eyes.`,
  content: `${npcData.name} is an ${npcData.ageStage} ${npcData.race}. ${capitalizeFirstLetter(
    npcData.heshe,
  )} is ${npcData.descriptor} with ${npcData.hair}${showBeard(npcData)}, and ${npcData.eyes} eyes. The most notable physical trait is their ${
    npcData.physicalTrait
  }.[br]Religion-wise, ${npcData.firstName} is an ${
    npcData.religion.strength
  }.[br][br][br][h2]Professional & Social[/h2][hr][br]${returnGenderBreakingSection(
    town,
    npcData,
  )} as a ${npcData.profession}.[br]${showSocialClass(npcData)}[br]${showNPCLanguages(npcData)}[br]${showSexuality(
    npcData,
    npcs,
  )}[br][br][br][h2]Misc[/h2][hr][br]${showHomeRoad(npcData, town)}`,
  seeded: `[br][h3]Bonds & Ideals:[/h3] ${npcData.bond} ${npcData.ideal}[br][br][br][h2]Personality & Quirks[/h2][hr][br]${getVocalPattern(
    npcData,
  )} ${getTraitsReadout(npcData)}When ${npcData.heshe} is relaxed, ${npcData.heshe} is ${
    npcData.calmTrait
  }. In moments of stress, ${npcData.heshe} becomes ${
    npcData.stressTrait
  }.[br][br][br][h2]Early Life[/h2][hr][br]${showEarlyLife(npcData)}[br][br][br][h2]Becoming a ${npcData.profession}[/h2][hr][br]${npcData.backgroundOrigin} ${
	  npcData.professionOrigin
  }[br][br][br][h2]Life Events[/h2][hr][br] ${getLifeEvents(
	  npcData,
  )}[br][br][br][h2]Relationships[/h2][hr][br][h3]NPCs[/h3]${getNPCRelationships(
	  npcData,
	  npcs,
	  town,
  )}[h3]Buildings[/h3]${getBuildingRelationships(
	  npcData,
	  npcs,
	  town,
  )}[h3]Factions[/h3]${getFactionRelationships(npcData, npcs, town)}[br][br][br][h2]Possessions[/h2][hr][br]${npcData.firstName} currently has ${
    npcData.pockets
  } in ${npcData.hisher} pockets and ${money(npcData.wealth)} to their name.${showWeapon(npcData)}${npcData.doesnt ? `[br]${npcData.doesnt}` : ''}[br][br][br][h2]Finances (Daily)[/h2][hr][br]${showNetIncome(
    town,
    npcData,
  )}[br][h3]Gross Income:[/h3] ${money(npcGrossIncome(town, npcData))}[br][h3]Taxes:/h3] ${money(
    npcTaxRate(town, npcData),
  )}[br][h3]Net Income:[/h3] ${money(
    npcNetIncome(town, npcData),
  )}[br][h3]Total Lifestyle Expenses ${npcLifestyleStandard(town, npcData)}:[/h3][br] ${money(
    npcTotalLifestyleExpenses(town, npcData),
  )}[br][h3]Profit:[/h3] ${money(npcProfit(town, npcData))}[br][h3]Creditors:[/h3] ${showCreditors(
    npcData,
    npcs,
  )}[br][h3]Debtors:[/h3] ${showDebtors(npcData, npcs)}`,
});

module.exports = {
  npcSeedData,
};
