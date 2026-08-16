import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';  
import tokenblackListModel from '../models/blacklistModel.js';

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
const userRegisterationContoller = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }
        // Check if user already exists
        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        if(password.length < 6){
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        const user = await userModel.create({
            email,
            name,
            password
        });
        // Jwt token denge for account creation
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

    res.status(201).json({
        message : "User registered successfully",
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        }
    })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


/**
 * @route POST /api/v1/auth/login
 * @desc Login a user
 * @access public
 */
const userLoginController = async(req,res)=>{
    const {email , password} = req.body || {};
    if(!email || !password){
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }
    if(password.length < 6){
        return res.status(400).json({
            message: 'Password must be at least 6 characters long'
        });
    }   
    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(400).json({
            message: 'User does not exist'
        });
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({
            message: 'Invalid password'
        });
    }
    // Generate JWT token
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message : "User logged in successfully",
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        }
    })
}

/**
 * @route POST /api/v1/auth/logout 
 * @description Logout controller
 * @access public 
 */

async function userLogOutController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1] || {}
    if(!token){
        return res.status(200).json({
            message : "user Logout successfully"
        })
    }
    res.cookie("token","")
    
    await tokenblackListModel.create({
        token : token 
    })
    res.status(200).json({
        message : "user logged out successfully "
    })
}

/**
 * @route GET /api/v1/auth/profile
 * @desc Get user profile
 * @access private
 */

const getUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.status(200).json({
            message: 'User profile fetched successfully',
            user :{
                id : user._id,
                username : user.name,
                email : user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { userRegisterationContoller ,userLoginController , userLogOutController, getUserProfileController};