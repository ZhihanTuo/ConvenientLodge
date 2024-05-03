import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
    email: {
    type: String,
    require: true,
    unique: true
  },
    password: { /* Does not need to be unique */
    type: String,
    require: true,
  }
}, { timestamps: true }); /* Timestamp for easier database filtering */

const User = mongoose.model('User', userSchema);

export default User;