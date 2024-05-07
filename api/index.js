import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

/* Connect to MongoDB, responds with message if connected */
mongoose.connect(process.env.MONGO).then(() => { {/* Hide mongoDB connection link using an environment variable */}
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.log(err);
  });

const app = express();

/* Run server */
app.use(express.json());

// To get info from cookies
app.use(cookieParser());

app.listen(3000, ()=> {
  console.log('Server is running on port 3000');
  }
);

/* using exported functions from routes directory */
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

/* middleware: err (error sent to middleware), req (data from browser), res (response from server to client side), next (next middleware) */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});