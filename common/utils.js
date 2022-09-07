function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function calcPercentage(target, integer) {
  if (Array.isArray(integer)) {
    return integer.reduce(calc, target);
  }
  return calc(target, integer);
}

function calc(target, integer) {
  return (target / 100) * (100 + integer);
}

module.exports = {
  capitalizeFirstLetter,
  calcPercentage,
};
