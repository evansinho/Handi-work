import express from 'express';
import {
  registerUser,
  setup2FA,
  verify2FA,
} from '../controllers/authController';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { getAllJobs, filterJobByStatus } from '../controllers/jobController';
import roleCheck from '../middlewares/roleCheck';
import { Role } from '@prisma/client';
import authMiddleware from '../middlewares/auth';
import {
  approveFreelancerProfile,
  rejectFreelancerProfile,
} from '../controllers/freelanceProfileController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/2fa/setup', setup2FA);
router.post('/2fa/verify', verify2FA);
router.get('/users', authMiddleware, roleCheck([Role.ADMIN]), getUsers);
router.get('/user/:id', authMiddleware, roleCheck([Role.ADMIN]), getUserById);
router.put('/user/:id', authMiddleware, roleCheck([Role.ADMIN]), updateUser);
router.delete('/user/:id', authMiddleware, roleCheck([Role.ADMIN]), deleteUser);
router.get('/jobs/all', authMiddleware, roleCheck([Role.ADMIN]), getAllJobs);
router.get('/jobs', authMiddleware, roleCheck([Role.ADMIN]), filterJobByStatus);
router.post(
  '/freelancer-profile/approve/:userId',
  authMiddleware,
  roleCheck([Role.ADMIN]),
  approveFreelancerProfile
);
router.post(
  '/freelancer-profile/reject/:userId',
  authMiddleware,
  roleCheck([Role.ADMIN]),
  rejectFreelancerProfile
);

export default router;
