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
