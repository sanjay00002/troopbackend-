import { alphanumeric } from 'nanoid-dictionary';
import { customAlphabet } from 'nanoid/async';

export async function generateUserId() {
  const userId = await customAlphabet(alphanumeric, 8);

  return await userId();
}
