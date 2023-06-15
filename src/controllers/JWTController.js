import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRY,
  ALGORITHM,
  REFRESH_TOKEN_EXPIRY,
  SECRET,
} from '../utils/settings';

export default {
  createToken: async (payload, refresh = false) => {
    const accessToken = jwt.sign(payload, SECRET, {
      algorithm: ALGORITHM,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    if (refresh) {
      const refreshToken = jwt.sign(payload, SECRET, {
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
};
