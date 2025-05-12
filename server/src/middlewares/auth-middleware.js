import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import jwt from "jsonwebtoken"
import userModel from "../models/users-model.js";


export const authMiddleware = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
        if(!token){
            throw new ApiError(401,"Unauthorized Request");
        }
    
        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET); 
        const user = await userModel.findById(decodedToken._id).select(
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
        throw error;
    }
})
