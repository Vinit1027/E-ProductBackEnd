import express from 'express';
import { getUsers, addUser,updateUser, deleteUser, signUpUsers, loginUsers} from '../controllers/user.controller'
const router = express.Router();




router.get('/get-users', getUsers);

router.post('/add-user', addUser);

router.patch('/update-user/:id', updateUser);

router.delete('/delete-user/:id', deleteUser);

router.post('/signup-user', signUpUsers);

router.post('/login-user', loginUsers);



export default router