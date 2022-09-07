const { getResources, getMembers, getLivery, getLeader, getLeaderCompetence, displaySeededAlliesRivals } = require('../common/factionUtils');
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const factionSeedData = (factionData, npcs, town, worldId) => ({
  // id: 'bff007dc-6362-4442-abfd-1fe1a2fab53d',
  title: `${factionData.name}`,
  subheading: `${capitalizeFirstLetter(factionData.type)} ${capitalizeFirstLetter(
    factionData.wordNoun,
  )} of ${town.name}`,
  template: 'organization',
  is_wip: false,
  is_draft: false,
  world: worldId,
  state: 'public',
  tags: `${town.name}, ${factionData.type}`,
  pronunciation: '',
  displaySidebar: false,
  userMetadata: {
    eigengrauId: factionData.key,
  },
  excerpt: `${factionData.name} is a ${capitalizeFirstLetter(factionData.type)} ${capitalizeFirstLetter(
    factionData.wordNoun,
  )}. They are a ${factionData.age} organization, with a ${
    factionData.reputation
  } reputation in the ${town.type}.`,
  content: `${factionData.name} is a ${capitalizeFirstLetter(
    factionData.type,
  )} ${capitalizeFirstLetter(factionData.wordNoun)}. They are a ${
    factionData.age
  } organization, whose reputation is ${factionData.reputation} in the ${
    town.type
  }.[br][br][br][h2]Governance[/h2][hr][br]${getLeader(factionData)}[br][br][br][h2]Members[/h2][hr][br]Members of ${factionData.name} are identifiable by ${
    factionData.membersTrait
  }. [br][br][br][h2]Resources[/h2][hr][br]They have ${
    factionData.resourcesDescription
  } resources.[br][br][br][h2]Politics[/h2][hr][br]They have ${
    factionData.alliesDescription
  }, and have ${factionData.rivalsDescription}.`,
  seeded: `[h2]RECOGNITION[/h2][hr][br]${getLivery(
    factionData,
  )}[br][br][h2]MOTIVATION[/h2][hr][br]They are motivated by ${
    factionData.motivation
  }, and they are ${factionData.misc}[br][br][br][h2]LEADERSHIP[/h2][hr][br]${getLeaderCompetence(factionData)}The ${factionData.wordNoun}'s position is ${factionData.stability} due to ${
    factionData.stabilityCause
  }. Bribes ${factionData.leaderBribes}.[br][br][br][h2]RESOURCES[/h2][hr][br]${getResources(
    factionData,
  )}[br][br][br][h2]MEMBERSHIP[/h2][hr][br]Membership requires ${
    factionData.joiningRequirement
  }, and costs ${factionData.joiningFee}. Initiation to ${factionData.name} involves ${
    factionData.joiningInitiation
  }.${getMembers(
    factionData,
    town.factionRelations,
  )}[br][br][br][h2]ALLIES[/h2][hr][br]${displaySeededAlliesRivals(factionData, 'allies')}[br][br][br][h2]ENEMIES[/h2][hr][br]${displaySeededAlliesRivals(factionData, 'rivals')}`,
});

module.exports = {
  factionSeedData,
};
