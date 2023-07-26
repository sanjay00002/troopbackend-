function calculatePayout(tp, ef, p) {
  let totalPeople = Number(Math.floor(tp).toFixed(0)),
    TotalPeople = Number(Math.floor(tp).toFixed(0)),
    entryFee = Number(ef),
    mper = Number(p);

  console.log('Inputs: ', totalPeople, TotalPeople, entryFee, mper);

  let totalAmount = totalPeople * entryFee;
  console.log(
    '🚀 ~ file: payout.js:10 ~ calculatePayout ~ totalAmount:',
    totalAmount,
  );

  // * Use loop to simulate number of iterations required to find final player count
  let noOfIterations;

  for (let i = 0; i < 1000; i++) {
    TotalPeople = Number(Math.floor(mper * TotalPeople).toFixed(0));

    if (TotalPeople == 1) {
      noOfIterations = i;
      break;
    }
  }
  console.log(
    '🚀 ~ file: payout.js:17 ~ calculatePayout ~ noOfIterations:',
    noOfIterations,
  );

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

  console.log('🚀 ~ file: payout.js:32 ~ calculatePayout ~ list_3:', list_3);
  console.log('🚀 ~ file: payout.js:44 ~ calculatePayout ~ list_5:', list_5);
  console.log('🚀 ~ file: payout.js:45 ~ calculatePayout ~ list_6:', list_6);

  // * Calculate the inverse square of the player count after each iteration
  let list_semi = list_5.map((y) => Math.pow(y, -2));
  console.log(
    '🚀 ~ file: payout.js:53 ~ calculatePayout ~ list_semi:',
    list_semi,
  );

  // * Calculate weight for each rank
  let weights = [];

  for (let i = 0; i < list_6.length; i++) {
    weights[i] = list_6[i] * list_semi[i];
  }
  console.log('🚀 ~ file: payout.js:59 ~ calculatePayout ~ weights:', weights);

  // * Calculate sum of weights
  let sum_weights = 0;
  for (let i = 0; i < weights.length; i++) {
    sum_weights += weights[i];
  }
  console.log(
    '🚀 ~ file: payout.js:66 ~ calculatePayout ~ sum_weights:',
    sum_weights,
  );

  // * Create a new list containing the payout for each player
  // * Payout is calculated by multiplying the weight with the additional payout and dividing the result by the sum of the weights
  // * The entry fee is added to each payout value in the list
  let weights_demi = weights;
  let minimum_distribution = mper * Number(Math.floor(totalAmount).toFixed(0));
  console.log(
    '🚀 ~ file: payout.js:81 ~ calculatePayout ~ weights_demi:',
    weights_demi,
  );
  console.log(
    '🚀 ~ file: payout.js:86 ~ calculatePayout ~ minimum_distribution:',
    minimum_distribution,
  );

  let additional_payout =
    (1 - mper) * Number(Math.floor(totalAmount).toFixed(0));
  console.log(
    '🚀 ~ file: payout.js:92 ~ calculatePayout ~ additional_payout:',
    additional_payout,
  );

  weights_demi = weights_demi.map((y) => y * additional_payout);
  console.log(
    '🚀 ~ file: payout.js:99 ~ calculatePayout ~ weights_demi:',
    weights_demi,
  );
  weights_demi = weights_demi.map((y) => y / sum_weights);
  console.log(
    '🚀 ~ file: payout.js:104 ~ calculatePayout ~ weights_demi:',
    weights_demi,
  );

  for (let i = 0; i < list_6.length; i++) {
    weights_demi[i] = weights_demi[i] / list_6[i];
  }
  console.log(
    '🚀 ~ file: payout.js:111 ~ calculatePayout ~ weights_demi:',
    weights_demi,
  );

  weights_demi = weights_demi.map((y) =>
    Number(Math.floor(y + Number(Math.floor(entryFee).toFixed(0))).toFixed(0)),
  );
  console.log(
    '🚀 ~ file: payout.js:120 ~ calculatePayout ~ weights_demi:',
    weights_demi,
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
    } else {
      sum += weights_demi[i];
      console.log(`Rank: ${list_5[i]}\t\t Payout: ${weights_demi[i]}`);
    }
  }
  console.log('🚀 ~ file: payout.js:129 ~ calculatePayout ~ sum:', sum);
  console.log('Payout to players: ', sum);
  console.log('Payout to organizers: ', totalAmount - sum);
}

// Usage example:
// You can call the function with the appropriate arguments like this:
calculatePayout(100, 12, 0.7);
