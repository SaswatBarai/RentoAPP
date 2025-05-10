import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/ayncHandler";
import jwt from "jsonwebtoken"
import userModel from "../models/users-model.js";


export const authMiddleware = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer","");
        if(!token){
            throw new ApiError(401,"Unauthorized Request");
        }
    
        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET); 
        const user = userModel.findById(decodedToken._id).select(
            "-password -refreshToken"
        );
    
        if(!user){
            throw new ApiError(
                401,
                "Invalid access token"
            )
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(
            500,
            error?.messgae ||"Invalid access token"
        );
    }
})
