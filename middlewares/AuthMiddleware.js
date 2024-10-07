import jwt from 'jsonwebtoken';
import validator from 'validator';


const jwtValidation = (req, res, next) => {
  // // get token from cookie
  const token = req.cookies.token;

  // get token from header
  // const token = req.headers.authorization.split(' ')[1];
  if (!token || validator.isEmpty(token)) {
    return res.status(401).json({
      message: 'No token provided',
    });
  }

  // decode token
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // assign data inside the token to the request body so that we can directly access these data in the request object in the route handler functions
    req.body.userId = decoded.id;
    req.body.username = decoded.username;
    req.body.isAdmin = decoded.isAdmin;
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  next();
};

export default  jwtValidation;
