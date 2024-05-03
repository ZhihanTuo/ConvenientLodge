import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

{/* found in controllers directory */}
router.get('/test', test );

export default router;