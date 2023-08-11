import calculatePayout from '../lib/payout';

require('dotenv').config();

const priceDistribution = {
  mega: calculatePayout(500, 99, process.env.PERCENTAGE),
  niftyIT: [
    calculatePayout(500, 11, process.env.PERCENTAGE),
    calculatePayout(500, 99, process.env.PERCENTAGE),
    calculatePayout(500, 199, process.env.PERCENTAGE),
  ],
  niftyAuto: [
    calculatePayout(500, 11, process.env.PERCENTAGE),
    calculatePayout(500, 99, process.env.PERCENTAGE),
    calculatePayout(500, 199, process.env.PERCENTAGE),
  ],
  niftyBank: [
    calculatePayout(500, 11, process.env.PERCENTAGE),
    calculatePayout(500, 99, process.env.PERCENTAGE),
    calculatePayout(500, 199, process.env.PERCENTAGE),
  ],
  gaintStocks: [
    calculatePayout(500, 99, process.env.PERCENTAGE),
    calculatePayout(500, 299, process.env.PERCENTAGE),
    calculatePayout(500, 499, process.env.PERCENTAGE),
  ],
  pennyStocks: [
    calculatePayout(500, 2, process.env.PERCENTAGE),
    calculatePayout(500, 5, process.env.PERCENTAGE),
    calculatePayout(500, 10, process.env.PERCENTAGE),
  ],
};

export default priceDistribution;
