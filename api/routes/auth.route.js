import express from 'express';
import { signup } from '../controllers/auth.controller.js';

const router = express.Router();

{/* found in controllers directory */}
router.post("/signup", signup);

export default router;