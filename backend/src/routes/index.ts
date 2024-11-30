import express from 'express';
import {
  registerUser,
  setup2FA,
  verify2FA,
  loginUser,
} from '../controllers/authController';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import {
  getAllJobs,
  filterJobByStatus,
  postJobs,
  retrieveJobs,
  updateJob,
  updateJobByStatus,
  messageArtisan,
} from '../controllers/jobController';
import roleCheck from '../middlewares/roleCheck';
import { Role } from '@prisma/client';
import authMiddleware from '../middlewares/auth';
import {
  approveArtisanProfile,
  rejectArtisanProfile,
  createArtisanProfile,
  getArtisanProfile,
  updateArtisanProfile,
  deleteArtisanProfile,
} from '../controllers/artisanProfileController';
import {
  getUserActivityMetrics,
  getAppPerformanceMetrics,
} from '../controllers/metricsController';
import { cloudinaryStorage } from '../services/cloudinary';
import multer from 'multer';
import {
  deletePortfolioItem,
  getPortfolioItems,
  uploadPortfolioItem,
} from '../controllers/portfolioItemController';
import { fetchRatings, postRating } from '../controllers/ratingsController';
import { searchArtisans } from '../controllers/artisanSearchController';
import {
  createPayment,
  getPaymentDetails,
  processPayment,
} from '../controllers/paymentController';

const router = express.Router();
const upload = multer({ storage: cloudinaryStorage });

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/2fa/setup', setup2FA);
router.post('/2fa/verify', verify2FA);
router.get('/users', authMiddleware, roleCheck([Role.ADMIN]), getUsers);
router.get('/user/:id', authMiddleware, roleCheck([Role.ADMIN]), getUserById);
router.put('/user/:id', authMiddleware, roleCheck([Role.ADMIN]), updateUser);
router.delete('/user/:id', authMiddleware, roleCheck([Role.ADMIN]), deleteUser);
router.get('/jobs/all', authMiddleware, roleCheck([Role.ADMIN]), getAllJobs);
router.get('/jobs', authMiddleware, roleCheck([Role.ADMIN]), filterJobByStatus);
router.post('/job', authMiddleware, roleCheck([Role.CLIENT]), postJobs);
router.get(
  '/jobs/:clientId',
  authMiddleware,
  roleCheck([Role.CLIENT]),
  retrieveJobs
);
router.put('/jobs/:id', authMiddleware, roleCheck([Role.CLIENT]), updateJob);
router.patch(
  '/job/:id/status',
  authMiddleware,
  roleCheck([Role.CLIENT]),
  updateJobByStatus
);
router.post(
  '/job/:jobId/message',
  authMiddleware,
  roleCheck([Role.CLIENT]),
  messageArtisan
);
router.get('/artisans', searchArtisans);
router.post(
  '/artisan-profile',
  authMiddleware,
  roleCheck([Role.ARTISAN]),
  createArtisanProfile
);
router.get(
  '/artisan-profile/:id',
  authMiddleware,
  roleCheck([Role.ARTISAN]),
  getArtisanProfile
);
router.put(
  '/artisan-profile/:id',
  authMiddleware,
  roleCheck([Role.ARTISAN]),
  updateArtisanProfile
);
router.delete(
  '/artisan-profile/:id',
  authMiddleware,
  roleCheck([Role.ARTISAN]),
  deleteArtisanProfile
);
router.post(
  '/artisan-profile/approve/:userId',
  authMiddleware,
  roleCheck([Role.ADMIN]),
  approveArtisanProfile
);
router.post(
  '/artisan-profile/reject/:userId',
  authMiddleware,
  roleCheck([Role.ADMIN]),
  rejectArtisanProfile
);
router.post('/portfolio', upload.single('image'), uploadPortfolioItem);
router.get('/portfolio/:artisanId', getPortfolioItems);
router.delete('/portfolio/:id', deletePortfolioItem);
router.get(
  '/metrics/user-activity',
  authMiddleware,
  roleCheck([Role.ADMIN]),
  getUserActivityMetrics
);
router.get(
  '/metrics/app-performance',
  authMiddleware,
  roleCheck([Role.ADMIN]),
  getAppPerformanceMetrics
);
router.post('/ratings', postRating);
router.get('/ratings/:userId', fetchRatings);
router.post('/payment', createPayment);
router.post('/payment/:id/process', processPayment);
router.get('/payment/:id', getPaymentDetails);

export default router;
