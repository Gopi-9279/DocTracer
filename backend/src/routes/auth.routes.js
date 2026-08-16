import {Router} from 'express';
import {userRegisterationContoller,userLoginController,userLogOutController,getUserProfileController} from '../controllers/auth.controller.js';
import {authuser} from '../middlewares/auth.middleware.js';
const authRouter = Router();

/**
 * @route POST /api/auth/register
 */
authRouter.post('/register', userRegisterationContoller);   
/**
 * @route POST /api/auth/login
 */
authRouter.post('/login', userLoginController);
/**
 * @route POST /api/auth/logout
 */
authRouter.post('/logout', authuser, userLogOutController);
/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access private
 */
authRouter.get('/profile', authuser, getUserProfileController);
export default authRouter;
