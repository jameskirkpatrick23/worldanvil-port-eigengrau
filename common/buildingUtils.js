function findRoadForBuilding(building, town) {
  const foundRoadKey = Object.keys(town.roads).find(
    (roadKey) => town.roads[roadKey].inhabitants.buildings[building.key],
  );
  let string = ``;
  const currentRoad = town.roads[foundRoadKey];
  if (currentRoad) {
    string += ` It is located on ${currentRoad.name}, a ${currentRoad.width} ${currentRoad.constructionMethod} road made partially from ${currentRoad.materialUsed}.`;
  }
  return string;
}

function showNotableFeature(building) {
  let string = ``;
  if (building.notableFeature) string += ` It is best known for ${building.notableFeature}.[br][br]`;
  if (building.draw && building.drawFeature) string += ` Regarding the ${building.draw}. ${building.drawFeature}[br][br]`;
  if (building.structure) string += ` The ${building.wordNoun}'s structure is that of ${building.structure.descriptor}.[br][br]`;
  if (building.notice) string += ` ${building.notice}[br][br]`;
  if (building.entertainment) string += ` ${building.entertainment}[br][br]`;
  if (building.feature) string += ` There is ${building.feature}[br][br]`;
  if (building.fun) string += ` ${building.fun}[br][br]`;
  if (building.specialty) string += ` Something of note is ${building.specialty}[br][br]`;
  if (building.rumour) string += ` It is rumoured that ${building.rumour}[br][br]`;
  if (building.game)
    string += `[br]GAME: ${building.game.name}[br][br]${building.game.rules}[br][br]`;
  return string;
}

function showDescription(building) {
	let string = ``;
	if (building.entrance) string += `The ${building.wordNoun}'s entrance is ${building.entrance}.[br]`;
	if (building.size && building.cleanliness) string += ` The building is ${building.size}, and ${building.cleanliness}.[br]`;
	if (building.tippyDescription) string += ` ${building.tippyDescription}[br]`;
	return string;
}

module.exports = {
  findRoadForBuilding,
  showNotableFeature,
	showDescription
};
