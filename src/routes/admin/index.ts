import express from 'express';
import flaggedUsersRoute from './flaggedUsers';
import usersRoute from './users';

const router = express.Router();

// All admin routes will be added here
router.use('/flagged-users', flaggedUsersRoute);
router.use('/users', usersRoute);

export default router; 