import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
dotenv.config();

{/* Connect to MongoDB, responds with message if connected */}
mongoose.connect(process.env.MONGO).then(() => { {/* Hide mongoDB connection link using an environment variable */}
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.log(err);
  });

const app = express();

{/* Run server */}
app.use(express.json());

app.listen(3000, ()=> {
  console.log('Server is running on port 3000');
  }
);

{/* using exported functions from routes directory */}
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);