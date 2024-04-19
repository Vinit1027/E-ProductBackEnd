import express from 'express';

import { getCategory, addCategory, updateCategory, deleteCategory } from '../controllers/category.controller';



const router = express.Router();



router.get('/get-category', getCategory);
router.post('/add-category', addCategory);
router.patch('/update-category/:id', updateCategory);
router.delete('/delete-category/:id', deleteCategory);



export default router