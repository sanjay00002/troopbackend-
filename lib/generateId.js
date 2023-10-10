// import { alphanumeric } from 'nanoid-dictionary';
// import { customAlphabet } from 'nanoid/async';

export async function generateUserId(defaultSize = 8) {
  const { customAlphabet } = await import('nanoid/async');
  const { alphanumeric } = await import('nanoid-dictionary');

  const userId = await customAlphabet(alphanumeric, defaultSize);

  return await userId();
}
