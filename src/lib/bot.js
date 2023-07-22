import { faker } from '@faker-js/faker/locale/en_IN';
import { generateUserId } from './userId';
import JWTController from '../controllers/JWTController';

export async function* generateNBotDetails() {
  while (true) {
    const id = `Bot-${await generateUserId()}`;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.userName({ firstName, lastName });
    const { accessToken, refreshToken } =
      await JWTController.createTokenForBots({ id: id }, true);

    const result = {
      id,
      username,
      firstName,
      lastName,
      accessToken,
      refreshToken,
      isBot: true,
    };
    yield result;
  }
}

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
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    let shuffledStocks = shuffle([...stockIdList]);

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

    // * Choose the captain and viceCaptain
    const selectedCopy = [...selectedStocks];
    const captainIndex = randomIndex(selectedCopy);
    const captain = selectedCopy[captainIndex];
    selectedCopy.splice(captainIndex, 1);
    const viceCaptainIndex = randomIndex(selectedCopy);
    const viceCaptain = selectedCopy[viceCaptainIndex];
    selectedCopy.splice(viceCaptainIndex, 1);

    selectedStocks[
      selectedStocks.findIndex((stock) => stock.stockId === captain.stockId)
    ].captain = true;
    selectedStocks[
      selectedStocks.findIndex((stock) => stock.stockId === viceCaptain.stockId)
    ].viceCaptain = true;

    return selectedStocks;
  } catch (error) {
    console.error('Error while creating portfolio for Bot: ', error);
  }
}
