import express from 'express';
import{signupAdmin, loginAdmin, getAdmin} from '../controllers/admin.controller'



const router = express.Router();



router.get('/get-admin', getAdmin);

router.post('/signup-admin', signupAdmin);

router.post('/login-admin', loginAdmin);



export default router


