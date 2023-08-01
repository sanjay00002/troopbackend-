export default function calculatePayout(tp, ef, p) {
  let totalPeople = Number(Math.floor(tp).toFixed(0)),
    TotalPeople = Number(Math.floor(tp).toFixed(0)),
    entryFee = Number(ef),
    mper = Number(p);

  const priceDistribution = [];

  console.log('Inputs: ', totalPeople, TotalPeople, entryFee, mper);

  let totalAmount = totalPeople * entryFee;
  // * Use loop to simulate number of iterations required to find final player count
  let noOfIterations;

  for (let i = 0; i < 1000; i++) {
    TotalPeople = Number(Math.floor(mper * TotalPeople).toFixed(0));

    if (TotalPeople == 1) {
      noOfIterations = i;
      break;
    }
  }
  let list_3 = [];

  for (let i = 0; i < noOfIterations + 1; i++) {
    totalPeople = Number(Math.floor(mper * totalPeople).toFixed(0));

    list_3[i] = totalPeople;
  }

  // * Create two additional lists to calculate payout structure
  let temp = [...list_3];
  let list_5 = [...temp.reverse()]; // * list_5 is a reversed copy of list_4 (more people in the end, less people in the beginning)
  let list_6 = []; // * list_6 is a list of the difference between adjacent elements in list_5

  for (let i = 0; i < list_3.length - 1; i++) {
    list_6[i] = list_5[i + 1] - list_5[i];
  }
  // * Calculate the inverse square of the player count after each iteration
  let list_semi = list_5.map((y) => Math.pow(y, -2));
  // * Calculate weight for each rank
  let weights = [];

  for (let i = 0; i < list_6.length; i++) {
    weights[i] = list_6[i] * list_semi[i];
  }
  // * Calculate sum of weights
  let sum_weights = 0;
  for (let i = 0; i < weights.length; i++) {
    sum_weights += weights[i];
  }
  // * Create a new list containing the payout for each player
  // * Payout is calculated by multiplying the weight with the additional payout and dividing the result by the sum of the weights
  // * The entry fee is added to each payout value in the list
  let weights_demi = weights;
  let minimum_distribution = mper * Number(Math.floor(totalAmount).toFixed(0));
  let additional_payout =
    (1 - mper) * Number(Math.floor(totalAmount).toFixed(0));
  weights_demi = weights_demi.map((y) => y * additional_payout);
  weights_demi = weights_demi.map((y) => y / sum_weights);
  for (let i = 0; i < list_6.length; i++) {
    weights_demi[i] = weights_demi[i] / list_6[i];
  }
  weights_demi = weights_demi.map((y) =>
    Number(Math.floor(y + Number(Math.floor(entryFee).toFixed(0))).toFixed(0)),
  );
  // * Calculate payout for each rank and print it
  // * If there is a gap in the ranking, the payout is calculated by multiplying the difference between the adjacent ranking values
  // * with the weight for the higher ranking
  let sum = 0;

  weights_demi.push(entryFee);

  for (let i = 0; i < list_5.length; i++) {
    if (list_5[i] - list_5[i - 1] > 1) {
      sum += (list_5[i] - list_5[i - 1] - 1) * weights_demi[i];
      console.log(
        `Rank: ${list_5[i - 1] + 1} to ${list_5[i]}\tPayout: ${
          weights_demi[i]
        }`,
      );

      priceDistribution.push({
        rankStart: list_5[i - 1] + 1,
        rankEnd: list_5[i],
        priceAmount: weights_demi[i],
      });
    } else {
      sum += weights_demi[i];
      priceDistribution.push({
        rankStart: list_5[i],
        rankEnd: list_5[i],
        priceAmount: weights_demi[i],
      });
      console.log(`Rank: ${list_5[i]}\t\t Payout: ${weights_demi[i]}`);
    }
  }
  console.log('Payout to players: ', sum);
  console.log('Payout to organizers: ', totalAmount - sum);
  console.log(
    'Price Distribution: ',
    JSON.stringify(priceDistribution, null, 4),
  );

  const samePriceAmount = priceDistribution.filter(
    (distribution) =>
      distribution.priceAmount ===
      priceDistribution[priceDistribution.length - 1].priceAmount,
  );

  samePriceAmount.sort((a, b) => a.rankStart - b.rankStart);

  const samePriceRanks = {
    rankStart: samePriceAmount[0].rankStart,
    rankEnd: samePriceAmount[samePriceAmount.length - 1].rankEnd,
    priceAmount: samePriceAmount[0].priceAmount,
  };

  console.log('Same Price Ranks: ', samePriceRanks);

  console.log('Same Price Amount: ', samePriceAmount);

  const firstRankWithSamePrice = priceDistribution.findIndex(
    (obj) => obj.rankStart === samePriceAmount[0].rankStart,
  );

  firstRankWithSamePrice !== -1 &&
    priceDistribution.splice(
      firstRankWithSamePrice,
      samePriceAmount.length,
      samePriceRanks,
    );

  return priceDistribution;
}
