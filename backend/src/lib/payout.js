// export default function calculatePayout(tp, ef, p) {
//   let totalPeople = Number(Math.floor(tp).toFixed(0)),
//     TotalPeople = Number(Math.floor(tp).toFixed(0)),
//     entryFee = Number(ef),
//     mper = Number(p);

//   const priceDistribution = [];

//   // console.log('Inputs: ', totalPeople, TotalPeople, entryFee, mper);

//   let totalAmount = totalPeople * entryFee;
//   // * Use loop to simulate number of iterations required to find final player count
//   let noOfIterations;

//   for (let i = 0; i < 1000; i++) {
//     TotalPeople = Number(Math.floor(mper * TotalPeople).toFixed(0));

//     if (TotalPeople == 1) {
//       noOfIterations = i;
//       break;
//     }
//   }
//   let list_3 = [];

//   for (let i = 0; i < noOfIterations + 1; i++) {
//     totalPeople = Number(Math.floor(mper * totalPeople).toFixed(0));

//     list_3[i] = totalPeople;
//   }

//   // * Create two additional lists to calculate payout structure
//   let temp = [...list_3];
//   let list_5 = [...temp.reverse()]; // * list_5 is a reversed copy of list_4 (more people in the end, less people in the beginning)
//   let list_6 = []; // * list_6 is a list of the difference between adjacent elements in list_5

//   for (let i = 0; i < list_3.length - 1; i++) {
//     list_6[i] = list_5[i + 1] - list_5[i];
//   }
//   // * Calculate the inverse square of the player count after each iteration
//   let list_semi = list_5.map((y) => Math.pow(y, -2));
//   // * Calculate weight for each rank
//   let weights = [];

//   for (let i = 0; i < list_6.length; i++) {
//     weights[i] = list_6[i] * list_semi[i];
//   }
//   // * Calculate sum of weights
//   let sum_weights = 0;
//   for (let i = 0; i < weights.length; i++) {
//     sum_weights += weights[i];
//   }
//   // * Create a new list containing the payout for each player
//   // * Payout is calculated by multiplying the weight with the additional payout and dividing the result by the sum of the weights
//   // * The entry fee is added to each payout value in the list
//   let weights_demi = weights;
//   let minimum_distribution = mper * Number(Math.floor(totalAmount).toFixed(0));
//   let additional_payout =
//     (1 - mper) * Number(Math.floor(totalAmount).toFixed(0));
//   weights_demi = weights_demi.map((y) => y * additional_payout);
//   weights_demi = weights_demi.map((y) => y / sum_weights);
//   for (let i = 0; i < list_6.length; i++) {
//     weights_demi[i] = weights_demi[i] / list_6[i];
//   }
//   weights_demi = weights_demi.map((y) =>
//     Number(Math.floor(y + Number(Math.floor(entryFee).toFixed(0))).toFixed(0)),
//   );
//   // * Calculate payout for each rank and print it
//   // * If there is a gap in the ranking, the payout is calculated by multiplying the difference between the adjacent ranking values
//   // * with the weight for the higher ranking
//   let sum = 0;

//   weights_demi.push(entryFee);

//   for (let i = 0; i < list_5.length; i++) {
//     if (list_5[i] - list_5[i - 1] > 1) {
//       sum += (list_5[i] - list_5[i - 1] - 1) * weights_demi[i];
//       // console.log(
//       //   `Rank: ${list_5[i - 1] + 1} to ${list_5[i]}\tPayout: ${
//       //     weights_demi[i]
//       //   }`,
//       // );

//       priceDistribution.push({
//         rankStart: list_5[i - 1] + 1,
//         rankEnd: list_5[i],
//         priceAmount: weights_demi[i],
//       });
//     } else {
//       sum += weights_demi[i];
//       priceDistribution.push({
//         rankStart: list_5[i],
//         rankEnd: list_5[i],
//         priceAmount: weights_demi[i],
//       });
//       // console.log(`Rank: ${list_5[i]}\t\t Payout: ${weights_demi[i]}`);
//     }
//   }
//   // console.log('Payout to players: ', sum);
//   // console.log('Payout to organizers: ', totalAmount - sum);
//   // console.log(
//   //   'Price Distribution: ',
//   //   JSON.stringify(priceDistribution, null, 4),
//   // );

//   const samePriceAmount = priceDistribution.filter(
//     (distribution) =>
//       distribution.priceAmount ===
//       priceDistribution[priceDistribution.length - 1].priceAmount,
//   );

//   samePriceAmount.sort((a, b) => a.rankStart - b.rankStart);

//   const samePriceRanks = {
//     rankStart: samePriceAmount[0].rankStart,
//     rankEnd: samePriceAmount[samePriceAmount.length - 1].rankEnd,
//     priceAmount: samePriceAmount[0].priceAmount,
//   };

//   // console.log('Same Price Ranks: ', samePriceRanks);

//   // console.log('Same Price Amount: ', samePriceAmount);

//   const firstRankWithSamePrice = priceDistribution.findIndex(
//     (obj) => obj.rankStart === samePriceAmount[0].rankStart,
//   );

//   firstRankWithSamePrice !== -1 &&
//     priceDistribution.splice(
//       firstRankWithSamePrice,
//       samePriceAmount.length,
//       samePriceRanks,
//     );
//   console.log(priceDistribution)
//   return priceDistribution;

// }

//This algorithm is only for participant count 200-500
export default function calculatePayout(tp, ef) {
  let numOfParticipants = Number(Math.floor(tp).toFixed(0));
  let entryAmount = Number(ef);

  const priceDistribution = [];

  const rankArray = Array.from({ length: numOfParticipants }, (_, i) => i + 1);
  // console.log(rankArray);
  const pricePoolBeforeRunningCharges = entryAmount * numOfParticipants;

  // console.log('Before charges price pool: ' + pricePoolBeforeRunningCharges);

  const originalPricePool =
    pricePoolBeforeRunningCharges - 0.25 * pricePoolBeforeRunningCharges;
  let totalPrizePoolRemaining = originalPricePool;

  // console.log('Price after cut pool: ' + originalPricePool);

  const percentile_50 = calculatePercentile(rankArray, 50);
  const percentile_75 = calculatePercentile(rankArray, 75);

  const indicesBetween50And75 = rankArray.reduce((acc, rank, index) => {
    if (rank > percentile_50 && rank <= percentile_75) {
      acc.push(index);
    }
    return acc;
  }, []);

  const numRanksBetween50And75 = indicesBetween50And75.length;

  for (let i = 0; i < rankArray.length; i++) {
    const rank = rankArray[i];

    if (rank === 1) {
      const yourReward = 0.1 * originalPricePool;
      totalPrizePoolRemaining -= yourReward;
      // console.log(`rank: ${rank}`);
      // console.log(`Your reward is: ${yourReward}`);
      priceDistribution.push({
        rankStart: 1,
        rankEnd: 1,
        priceAmount: yourReward,
      });
    }

    if (rank === 2) {
      const yourReward = 0.025 * originalPricePool;
      totalPrizePoolRemaining -= yourReward;
      // console.log(`rank: ${rank}`);
      // console.log(`Your reward is: ${yourReward}`);
      priceDistribution.push({
        rankStart: 2,
        rankEnd: 2,
        priceAmount: yourReward,
      });
    }

    if (rank === 3) {
      const yourReward = 0.01 * originalPricePool;
      totalPrizePoolRemaining -= yourReward;
      // console.log(`rank: ${rank}`);
      // console.log(`Your reward is: ${yourReward}`);
      priceDistribution.push({
        rankStart: 3,
        rankEnd: 3,
        priceAmount: yourReward,
      });
    }

    if (rank > 3 && rank < 11) {
      const yourReward = 0.005 * originalPricePool;
      totalPrizePoolRemaining -= yourReward;
      // console.log(` rank: ${rank}`);
      // console.log(`Your reward is: ${yourReward}`);
      if (rank === 10) {
        priceDistribution.push({
          rankStart: 4,
          rankEnd: 10,
          priceAmount: yourReward,
        });
      }
    }

    if (rank >= 11 && rank < 26) {
      const yourReward = 0.0035 * originalPricePool;
      totalPrizePoolRemaining -= yourReward;
      // console.log(`rank: ${rank}`);
      // console.log(`Your reward is: ${yourReward}`);
      if (rank === 25) {
        priceDistribution.push({
          rankStart: 11,
          rankEnd: 25,
          priceAmount: yourReward,
        });
      }
    }

    if (rank >= 26 && rank <= percentile_50) {
      const yourReward = entryAmount;
      totalPrizePoolRemaining -= yourReward;
      // console.log(`rank: ${rank}`);
      // console.log(`Your reward is: ${yourReward}`);
      if (rank === parseInt(percentile_50)) {
        priceDistribution.push({
          rankStart: 26,
          rankEnd: parseInt(percentile_50),
          priceAmount: yourReward,
        });
      }
    }
  }

   // console.log('Total Prize Pool Remaining after distributing remaining:',totalPrizePoolRemaining,);
  let remains = totalPrizePoolRemaining;

  for (let i = 0; i < rankArray.length; i++) {
    const rank = rankArray[i];
    const yourRewardforAll = remains / numRanksBetween50And75;

    if (rank >= percentile_50 && rank < percentile_75) {
      const yourReward = remains / numRanksBetween50And75;
      totalPrizePoolRemaining -= yourReward;
      // console.log(`rank: ${rank}`);
      // console.log(`Your reward is: ${yourReward}`);
    }
    if (rank === parseInt(percentile_75)) {
      priceDistribution.push({
        rankStart: parseInt(percentile_50) + 1,
        rankEnd: parseInt(percentile_75),
        priceAmount: yourRewardforAll,
      });
    }
  }

  // console.log('Total Prize Pool Remaining after distributing remaining:',totalPrizePoolRemaining,);
  // console.log(priceDistribution);

  function calculatePercentile(arr, percentile) {
    const index = Math.ceil((percentile / 100) * arr.length) - 1;
    return arr[index];
  }

  priceDistribution.push({originalPricePool})
  return priceDistribution;
}
