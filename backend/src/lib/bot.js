import { faker } from '@faker-js/faker/locale/en_IN';
import { generateUserId } from './userId';
import JWTController from '../controllers/JWTController';

// export async function* generateNBotDetails() {
//   while (true) {
//     const id = `Bot-${await generateUserId()}`;
//     const firstName = faker.person.firstName();
//     const lastName = faker.person.lastName();
//     const username = faker.internet.userName({ firstName, lastName });
//     const { accessToken, refreshToken } =
//       await JWTController.createTokenForBots({ id: id }, true);

//     const result = {
//       id,
//       username,
//       firstName,
//       lastName,
//       accessToken,
//       refreshToken,
//       isBot: true,
//     };
//     yield result;
//   }
// }

// export async function* generateNBots(min, max) {
//   let current = min;

//   while (current < max) {
//     current++;
//     yield { isBot: true };
//   }
// }

// export const generateNBots = {
//   [Symbol.iterator]: function* (min, max) {
//     let current = min;

//     while (current < max) {
//       current++;
//       yield { isBot: true };
//     }
//   },
// };

// const generatorFn = generateNBotDetails();

// generatorFn.next().then((value, done) => console.log(value.value));
// generatorFn.next().then((value, done) => console.log(value));
function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

export function createPortfolioForBot(stockIdList) {
  try {
    if (!Array.isArray(stockIdList) || stockIdList.length === 0) {
      throw new Error('StockId list is empty or undefined');
    }

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const filteredStockIdList = stockIdList.filter((stockId) => stockId != null);

    if (filteredStockIdList.length < 5) {
      throw new Error('Not enough unique stocks in the stockIdList');
    }

    let shuffledStocks = shuffle([...filteredStockIdList]);

    let count = 0;
    const selectedStocks = [];
    const actions = ['Buy', 'Sell'];

    while (count < 5) {
      let random = randomIndex(shuffledStocks);
      selectedStocks.push({
        stockId: shuffledStocks[random],
        action: actions[randomIndex(actions)],
        captain: false,
        viceCaptain: false,
      });
      shuffledStocks.splice(random, 1);
      shuffledStocks = shuffle([...shuffledStocks]);
      count++;
    }

    // Choose the captain and viceCaptain
    const captainIndex = randomIndex(selectedStocks);
    let viceCaptainIndex = randomIndex(selectedStocks);

    // Ensure that the viceCaptain is a different stock than the captain
    while (viceCaptainIndex === captainIndex) {
      viceCaptainIndex = randomIndex(selectedStocks);
    }

    selectedStocks[captainIndex].captain = true;
    selectedStocks[viceCaptainIndex].viceCaptain = true;

    // console.log('Shuffled Stocks:', shuffledStocks);
    // console.log('Selected Stocks:', selectedStocks);

    return selectedStocks;
  } catch (error) {
    console.error('Error while creating portfolio for Bot: ', error);
    throw error;
  }
}

