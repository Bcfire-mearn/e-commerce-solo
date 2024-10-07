import User from '../models/User.js';
import * as argon2 from 'argon2';
import generateToken from '../utils/generateToken.js';

const register = async (req, res) => {
  // get credentials from body
  const { username, password, email } = req.body;

  try {
    // check if username already exists
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: 'Username already exists', statusCode: 409 });
    }
    const duplicateE = await User.findOne({ email }).lean().exec();
    if (duplicateE) {
      return res.status(409).json({ message: 'Email already exists', statusCode: 409 });
    }
    // hash password
    const UIpassword = unhashData(password)
    const hashedPassword = await argon2.hash(UIpassword);

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // generate JWT token
    const token = generateToken(user._id, user.isAdmin, username);

    // send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict',
    });

    // send token in response
    return res.status(201).json({ token, statusCode: 201 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
};

const login = async (req, res) => {
  // get credentials from body
  const { emailOrUsername, password } = req.body;

  try {
    let user = await User.findOne({ username: emailOrUsername }).lean().exec();

    if (!user) {
      user = await User.findOne({ email: emailOrUsername }).lean().exec();
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials', statusCode: 401 });
      }
    }
    const UIpassword = unhashData(password)
    // check if password is correct
    const isPasswordCorrect = await argon2.verify(user.password, UIpassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials', statusCode: 401 });
    }

    // generate JWT token
    const token = generateToken(user._id, user.isAdmin, user.username);

    // send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict',
    });

    // send token in response
    return res.status(200).json({ token, isAdmin: user.isAdmin, statusCode: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
};

const logout = (_req, res) => {
  try {
    // clear cookie in browser;
    res.clearCookie('token');
    // invalidate the token
    return res.status(200).json({ message: 'Logged out successfully', statusCode: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
};


const getCurrentUser = async (req, res) => {
  const { userId, username } = req.body;
  try {
    const existingUser = await User.findById(userId)
      .populate('favorites')
      .lean()
      .exec();
    if (!existingUser || existingUser.username !== username) {
      return res.status(401).json({ message: 'Invalid credentials', statusCode: 401 });
    } else {
      const { password, __v, ...returnUser } = existingUser;
      const favoriteIds = existingUser.favorites.map(fav=>fav._id)
      return res.status(200).json({ ...returnUser, favoriteIds, statusCode: 200 });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
}

const adminAccess = async (req, res) => {
  const { isAdmin } = req.body;
  try {
    if (isAdmin) {
      const listUsers = await User.find({ isAdmin: false })
        .populate('favorites')
        .lean()
        .exec();
      const sanitizedUser = helperAdmindata(listUsers)
      const returnData = {
        users: sanitizedUser,
        length: sanitizedUser.length
      }
      return res.status(200).json(returnData);

    } else {
      return res.status(403).json({ message: 'Forbidden, admin only' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
}
const unhashData = (encodedData) => atob(encodedData);

const helperAdmindata = (users) => {
  return users.map(user => {
    const { password, __v, ...sanitizedUser } = user;
    sanitizedUser.favorites = sanitizedUser.favorites.map(fav => {
      const { __v, ...sanitizedFav } = fav;
      return sanitizedFav;
    });
    return sanitizedUser;
  });
}

export { register, login, logout, getCurrentUser, adminAccess };
