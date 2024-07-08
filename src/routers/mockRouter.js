import express from 'express';
import { generateMockProducts } from '../controllers/mockController.js';

const router = express.Router();

router.get('/mockingproducts', generateMockProducts);

export default router;
