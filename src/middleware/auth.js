import jwt from 'jsonwebtoken';
import { SECRET } from '../utils/settings';

export default function validate(req, res, next) {
  let token = req.headers['authorization'];

  const accessToken = token?.split(' ')[1];

  jwt.verify(accessToken, SECRET, (error, user) => {
    if (!error) {
      req.id = user.id;
      next();
    } else {
      return res.status(403).json({ message: 'User Unauthorized!' });
    }
  });
}
