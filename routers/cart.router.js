import express from 'express'
import { addToCart, getCartData, updateCartQuantity, deleteCartData} from '../controllers/cart.controller'

const router = express.Router();


router.post('/add-to-cart',addToCart);
router.get('/get-cart',getCartData);
router.patch('/update-quantity/:id',updateCartQuantity);
router.delete('/deleteCartData/:id', deleteCartData);

export default router;