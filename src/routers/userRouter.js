import express from 'express';
import multer from 'multer';
import User from '../models/userModel.js';
import { sendMail } from '../config/mailer.js';
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

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role').lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.delete('/', async (req, res) => {
  try {
    const twoDays = new Date (Date.now() - 2 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await User.find({ last_connection: { $lt: twoDays } });

    inactiveUsers.forEach(async (user) => {
      await sendMail(user.email, 'Cuenta eliminada por inactividad', `Hola ${user.name}, tu cuenta ha sido eliminada por inactividad.`);
      await user.remove();
    });

    res.status(200).json({ message: 'Usuarios inactivos eliminados' }); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post('/register', registerUser);
userRouter.get('/github', authenticateGitHub);
userRouter.get('/githubSession', githubSession);
userRouter.post('/:uid/documents', upload.array('documents'), uploadDocuments);

export default userRouter;
