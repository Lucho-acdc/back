import express from 'express';
import { loginUser, logoutUser } from '../controllers/sessionController.js';

const sessionRouter = express.Router();

sessionRouter.post('/login', loginUser);
sessionRouter.post('/logout', logoutUser);

export default sessionRouter;
