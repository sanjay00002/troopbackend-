import { alphanumeric } from 'nanoid-dictionary';
import { customAlphabet } from 'nanoid/async';

export async function generateUserId(defaultSize = 8) {
  const userId = await customAlphabet(alphanumeric, defaultSize);

  return await userId();
}
