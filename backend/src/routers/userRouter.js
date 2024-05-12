import express from 'express';
import { registerUser, authenticateGitHub, githubSession } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/github', authenticateGitHub);
userRouter.get('/githubSession', githubSession);

export default userRouter;
