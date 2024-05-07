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