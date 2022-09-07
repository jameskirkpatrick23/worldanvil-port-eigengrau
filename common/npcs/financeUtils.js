const { calcPercentage } = require('../utils');
const { findProfession } = require('./professionUtils');
const { socialClasses } = require('./socialUtils');
const { lifestyleStandards } = require('./lifestyleStandards');

const getPriceMod = (priceModSource) => {
  if (typeof priceModSource === 'object' && typeof priceModSource.priceModifier === 'number') {
    return 1 - priceModSource.priceModifier / 100;
  }
  if (typeof priceModSource === 'number') {
    return 1 - priceModSource / 100;
  }
  return 1;
};

const money = (copper, priceMod) => {
  if (priceMod) copper = Math.round(copper * getPriceMod(priceMod));
  let silver;
  let gold;
  let isNegative = false;
  if (copper < 0) {
    isNegative = true;
  }
  copper = Math.abs(copper);
  const conversionRates = {
    silverStandard: {
      copperToGold: 10000,
      silverToGold: 100,
    },
  };
  const conversions = conversionRates.silverStandard;

  if (copper >= conversions.copperToGold) {
    gold = Math.trunc(copper / conversions.copperToGold);
    copper %= conversions.copperToGold;
  } else {
    gold = 0;
  }
  if (copper >= conversions.silverToGold) {
    silver = Math.trunc(copper / conversions.silverToGold);
    copper %= conversions.silverToGold;
  } else {
    silver = 0;
  }

  let output = '';
  if (isNegative) output += '-';
  if (gold > 0) output = `${output}${gold} Gold`;
  if (silver > 0) output = `${output} ${silver} Silver`;
  if (copper > 0) output = `${output} ${copper} Copper`;
  return output;
};

function npcLifestyleExpenses(town, npc) {
  // console.log(`Returning ${npc.name}'s lifestyle expenses...`)
  const income = npcGrossIncome(town, npc);
  return Math.round(income * (npcLifestyleStandard(town, npc).dailyWagePercentage / 100));
}

function npcTotalLifestyleExpenses(town, npc) {
  return Math.round(
    npcLifestyleExpenses(town, npc) + npcLifestyleStandard(town, npc).incomeThreshold,
  );
}

function npcProfit(town, npc) {
  // console.log(`Returning ${npc.name}'s profit...`)
  return Math.round(npcNetIncome(town, npc) - npcTotalLifestyleExpenses(town, npc));
}

function npcNetIncome(town, npc) {
  // console.log(`Returning ${npc.name}'s net income...`)
  return Math.round(calcPercentage(npcGrossIncome(town, npc), -npcTaxRate(town, npc)));
}

function npcTaxRate(town, npc) {
  let totalTax = 0;

  Object.keys(town.taxes).map(tax => {
	  if (tax === 'land') {
		  totalTax += town.taxes[tax] * (socialClasses[npc.socialClass].landRate || 1);
	  } else if (typeof town.taxes[tax] === 'number') {
		  totalTax += town.taxes[tax];
	  } else {
		  console.error(`non-integer tax! ${town.taxes[tax]}`);
	  }
  })

  return Math.round(totalTax * 100) / 100;
}

function wageVariation(town, npc) {
  return calcPercentage(npc.roll.professionLuck, (town.roll.wealth - 50) / 5);
}

function npcGrossIncome(town, npc) {
  const profession = findProfession(town, npc);
  return Math.round(
    calcPercentage(profession.dailyWage, (wageVariation(town, npc), (town.roll.wealth - 50) / 3)),
  );
}

function npcNetIncome(town, npc) {
  // console.log(`Returning ${npc.name}'s net income...`)
  return Math.round(calcPercentage(npcGrossIncome(town, npc), -npcTaxRate(town, npc)));
}

function showNetIncome(town, npc) {
  let dataString = `${npc.firstName} currently earns `;
  if (npcNetIncome(town, npc) > 1) {
    dataString += 'next to nothing per day.';
  } else {
    dataString += `${money(npcNetIncome(town, npc))} per day.`;
  }
  return dataString;
}
function npcLifestyleStandard(town, npc) {
  // console.log(`Returning ${npc.name}'s lifestyle standard...`)
  const income = npcNetIncome(town, npc);
	const found = Object.values(lifestyleStandards).find(lifestyleStandard => {
		if (income >= lifestyleStandard.incomeThreshold) {
			return lifestyleStandard;
		}
	})
	if (found) return `${found.lifestyleStandard} (${found.lifestyleDescription})`;
  return `${lifestyleStandards.modest.lifestyleStandard} (${lifestyleStandards.modest.lifestyleDescription})`;
}

function showCreditors(npc, npcs) {
  return Object.keys(npc.finances.creditors).map(
    (creditorKey) =>
      `[h4]Money owed to ${npcs[creditorKey].name}:[/h4] ${money(
        npc.finances.creditors[creditorKey],
      )}`,
  );
}

function showDebtors(npc, npcs) {
	if (!npc.finances  || !npc.finances.debtors) {
		return '';
	}
  return Object.keys(npc.finances.debtors).map((debtorKey) => {
	  if (npcs[debtorKey] && npcs[debtorKey].name) {
		  return `[h4]Money owed by ${npcs[debtorKey].name}:[/h4] ${money(npc.finances.debtors[debtorKey])}`
	  }
  });
}

module.exports = {
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
};
