import express from 'express';
import multer from 'multer';
import { registerUser, uploadDocuments, authenticateGitHub, githubSession } from '../controllers/userController.js';

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'profile') {
        cb(null, 'uploads/profiles');
      } else if (file.fieldname === 'product') {
        cb(null, 'uploads/products');
      } else {
        cb(null, 'uploads/documents');
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
const upload = multer({ storage });

userRouter.post('/register', registerUser);
userRouter.get('/github', authenticateGitHub);
userRouter.get('/githubSession', githubSession);
userRouter.post('/:uid/documents', upload.array('documents'), uploadDocuments);

export default userRouter;
