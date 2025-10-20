import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"

// const healthChecks=async (req,res)=>{//when we are using async we need to use try catch instead of that we use asyncHandler
//     try {
//         return res.status(200)
//     } catch (error) {
        
//     }
// }
// /alternative

const healthCheck=asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,"ok","HealthCheckPasses"))
})

export {healthCheck}