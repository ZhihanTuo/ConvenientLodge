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
    // First check email, then check password
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
};

export const google = async(req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email });
    // Check if user exists; If so create token and separate password from rest of user info
    if (user) {
      // Token consisting of user's _id and env variable unique to this app 
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true }) 
        .status(200)
        .json(rest);
    } else {
      // Creates new user if user does not already exist
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // Conjoin last 8 digits(because random() returns a value between 0-1) of 2 random numbers that contains integers 0-9 and letters a-z
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({ 
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-3), 
        email: req.body.email, 
        password: hashedPassword, 
        avatar: req.body.photo }); // Generate lowercase username with random numbs and omit spaces
      await newUser.save();
      // Token consisting of user's _id and env variable unique to this app 
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true }) 
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error) // Handled by middleware in index.js
  }
};