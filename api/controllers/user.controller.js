import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res)=> {
  res.json({
    message: 'API Route is Working',
  });
}

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) { return next(errorHandler(401, 'You can only update your own account!')) }
  try {
    // Hash the password if user is trying to change password 
    if(req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      $set: { // All mutable fields for user
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar
      }
    }, {new: true}) // Returns user with the new information
    const { password, ...rest } = updateUser._doc
    res.status(200).json(rest);
  } catch (error) {
    next(error); // Handled by middleware
  }
};

export const deleteUser = async (req, res, next) => {
  // params.id = :id 
  if (req.user.id != req.params.id) { return next(errorHandler(401, 'Unauthorized access')) } 
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token'); // Clear the cookie of access_token
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error); // Handled by middleware
  }
};

export const getUserListings = async (req, res, next) => {
  // If ids match, try to get listings' JSONs
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error) //Handled by middleware
    }
  } else {
    return next(errorHandler(401, 'Unauthorized listing access'))
  }
};

export const getUser = async (req,res, next) => {
try {
    const user = await User.findById(req.params.id);
  if (!user) { return next(errorHandler(404, 'User not found')); }
  // Omit password
  const { password: pass, ...rest } = user._doc;
  // Returns everything else
  res.status(200).json(rest);
} catch (error) {
  next(error);
}
}