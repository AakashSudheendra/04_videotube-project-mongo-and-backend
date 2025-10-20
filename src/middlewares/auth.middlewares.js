import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"

///this is a middle ware that we have created because for log out session it is just becaus to verify access token and calling its id and just removing refresh token so that it will be logged out 

export const verifyJWT=asyncHandler(async (req,__,next)=>{//here next is written u will get knowledge when we are injecting this in the user.route.js
    let token=req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")//key,bearer and it has value of acccess token
    if(!token){
        throw new ApiError(404,"Unauthorized")
    }
    //now we need decoded token means an jwt token contains all username ,full name and everything now jwt.verify returns an object
    try {
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        //after decoding we need to find the user with id and u need to remove the refreshtoken 
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"UnAuthorized")
        }
        req.user=user//This saves the user in the req object so future middleware or route handlers can access it.
        next()//passing through next middle ware or next controller this is veryhelpful
    } catch (error) {
        throw new ApiError(404,"Invalid Acces token")
    }

})

