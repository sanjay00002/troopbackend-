import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRY,
  ALGORITHM,
  BOT_ACCESS_TOKEN_EXPIRY,
  BOT_REFRESH_TOKEN_EXPIRY,
  REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRY,
  SECRET,
} from '../utils/settings';
import crypto from 'crypto';

export default {
  createToken: async (payload, refresh = false) => {
    const accessToken = jwt.sign(payload, SECRET, {
      algorithm: ALGORITHM,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    if (refresh) {
      const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });
      console.log('Access Token: ', accessToken);
      console.log('Refresh Token: ', refreshToken);

      return { accessToken, refreshToken };
    }
    console.log('Access Token: ', accessToken);

    return accessToken;
  },
  hashToken: async (token) => {
    const algorithm = 'sha256';

    const hash = await crypto.createHash(algorithm);
    hash.update(token);
    const hashedToken = await hash.digest('hex');

    return hashedToken;
  },
  createTokenForBots: async (payload, refresh = false) => {
    const accessToken = jwt.sign(payload, SECRET, {
      algorithm: ALGORITHM,
      expiresIn: BOT_ACCESS_TOKEN_EXPIRY,
    });

    if (refresh) {
      const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: BOT_REFRESH_TOKEN_EXPIRY,
      });
      console.log('Bot Access Token: ', accessToken);
      console.log('Bot Refresh Token: ', refreshToken);

      return { accessToken, refreshToken };
    }
    console.log('Bot Access Token: ', accessToken);

    return accessToken;
  },
};
