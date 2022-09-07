const { findRoadForBuilding, showNotableFeature, showDescription } = require('../common/buildingUtils');
const { capitalizeFirstLetter } = require('../common/utils');

const buildingSeedData = (buildingData, npcs, town, worldId) => ({
  // id: 'bff007dc-6362-4442-abfd-1fe1a2fab53d',
  title: `${buildingData.name}`,
  subheading: `${capitalizeFirstLetter(
    buildingData.wordNoun,
  )} of ${town.name}`,
  template: 'location',
  is_wip: false,
  is_draft: false,
  world: worldId,
  state: 'public',
  tags: `${town.name}, ${buildingData.type}`,
  pronunciation: '',
  displaySidebar: false,
  userMetadata: {
    eigengrauId: buildingData.key,
  },
  excerpt: `${buildingData.name} is a ${buildingData.wordNoun} within the ${town.type} of ${town.name}.${findRoadForBuilding(buildingData, town)}`,
  content: `${buildingData.name} is a ${buildingData.wordNoun}.${findRoadForBuilding(buildingData, town)}[br][br]${showDescription(buildingData)}[br][br]${showNotableFeature(buildingData, town)}`,
});

module.exports = {
  buildingSeedData,
};
