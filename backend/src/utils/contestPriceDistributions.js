import calculatePayout from '../lib/payout';

require('dotenv').config();

const priceDistribution = {
  mega: calculatePayout(500, 99),
  niftyIT: [
    calculatePayout(500, 11),
    calculatePayout(500, 99),
    calculatePayout(500, 199),
  ],
  niftyAuto: [
    calculatePayout(500, 11),
    calculatePayout(500, 99),
    calculatePayout(500, 199),
  ],
  niftyBank: [
    calculatePayout(500, 11),
    calculatePayout(500, 99),
    calculatePayout(500, 199),
  ],
  giantStocks: [
    calculatePayout(500, 99),
    calculatePayout(500, 299),
    calculatePayout(500, 499),
  ],
  pennyStocks: [
    calculatePayout(500, 2),
    calculatePayout(500, 5),
    calculatePayout(500, 10),
  ],
};

export default priceDistribution;
