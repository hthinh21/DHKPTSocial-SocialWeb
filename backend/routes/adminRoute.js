import express from 'express';
import { loginAdmin } from '../controllers/adminControllers.js'; 
import { updateStatus } from '../controllers/adminControllers.js';
const router = express.Router();

router.post('/login', loginAdmin);
router.put('/status/:id', updateStatus);

export default router;