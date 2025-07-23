import express from 'express';
import flaggedUsersRoute from './flaggedUsers';

const router = express.Router();

// All admin routes will be added here
router.use('/flagged-users', flaggedUsersRoute);

export default router; 