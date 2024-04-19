import express from 'express';
import auth from '../middlewares/auth.middleware';
import {getProducts, getSingleProduct, addProduct, updateProduct, deleteProduct} from '../controllers/product.controller';


const router = express.Router();


router.get('/get-products', getProducts);
router.get('/get-product/:id', getSingleProduct);
router.post('/add-product',auth, addProduct);
router.patch('/update-product/:id', updateProduct);
router.delete('/delete-product/:id', deleteProduct);

export default router