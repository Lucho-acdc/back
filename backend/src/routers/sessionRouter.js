import express from 'express';
import { renderRequestResetPassword, requestResetPassword, renderResetPassword, resetPassword, loginUser, logoutUser } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/requestResetPassword', renderRequestResetPassword);
router.post('/requestResetPassword', requestResetPassword);

router.get('/resetPassword', renderResetPassword);
router.post('/resetPassword', resetPassword);

export default router;
