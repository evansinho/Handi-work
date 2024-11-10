import express from 'express';
import {
  registerUser,
  setup2FA,
  verify2FA,
} from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/2fa/setup', setup2FA);
router.post('/2fa/verify', verify2FA);

export default router;
