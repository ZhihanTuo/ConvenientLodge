import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

{/* get username, email, password from user and creates a new user with those parameters 
* password is hashed before being passed in to a User object */}
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }); // Takes time to check through database
    // First check user, then check password
    if (!validUser) { return next(errorHandler(404, 'User not found!')); }
    const validPassword = bcryptjs.compareSync(password, validUser.password); // Need to compare the hashed password with bcryptjs.compareSync
    if (!validPassword) { return next(errorHandler(401, 'Wrong credentials!')); }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // Token consisting of user's _id and env var unique to this app
    const { password: pass, ...rest } = validUser._doc; // Separates password from rest of user info
    res
      .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 182)}) // Token will be not be accessible by 3rd party and expires in half a year
      .status(200)
      .json(rest);
  } catch (error) {
    next(error); // Handled by middleware in index.js
  }
}