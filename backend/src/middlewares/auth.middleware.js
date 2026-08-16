import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import blackListModel from '../models/blacklistModel.js';

async function authuser(req,res,next){
    const token = req.cookies.token

    if(!token){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "Token not provided"
        })
    }
    
    const isTokenBlacklisted = await blackListModel.findOne({token}) 
    if(isTokenBlacklisted){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "Token is invalid"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()
    }
    catch(err){return res.status(StatusCodes.UNAUTHORIZED).json({message:"Invalid Token."})}
    

}


export {authuser}  