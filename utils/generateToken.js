import jwt from 'jsonwebtoken';

const generateToken = (id, isAdmin, username) => {
  const token = jwt.sign({ id, isAdmin, username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

export default generateToken;
