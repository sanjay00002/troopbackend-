import { alphanumeric } from 'nanoid-dictionary';
import { customAlphabet } from 'nanoid/async';

export async function generateReferralCode() {
  const referralCode = await customAlphabet(alphanumeric, 10);

  return await referralCode();
}
