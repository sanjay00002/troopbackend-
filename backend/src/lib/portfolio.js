export function validatePortfolio(stocks) {
  // * Check that the stocks have at least one captain and one viceCaptain field set as true
  // * Also check if both of the fields(captain & viceCaptain) are not set to true
  let isCaptain = false,
    isViceCaptain = false;

  if (stocks?.length > 5) {
    throw Error('Can select only 5 stocks!');
  }

  for (let i = 0; i < stocks?.length; i++) {
    const stock = stocks[i];
    if (stock.captain === true && stock.viceCaptain === true) {
      throw Error(
        'Same stock cannot be Captain and Vice Captain at the same time',
      );
    } else if (isCaptain === true && stock.captain === true) {
      throw Error("There can't be 2 captains!");
    } else if (isViceCaptain === true && stock.viceCaptain === true) {
      throw Error("There can't be 2 vice captains!");
    }
    isCaptain = stock.captain === true ? true : isCaptain;
    isViceCaptain = stock.viceCaptain === true ? true : isViceCaptain;
  }
}
