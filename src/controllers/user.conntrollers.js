import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
// import { upload } from "../middlewares/multer.middlewares.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

let options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(500, "User doesn't Find");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    //after generating token send to user

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something Went Wrong During Creation of Refresh And Access Tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get from the frontend or postman right now we are getting from post man so
  const { fullname, email, username, password } = req.body;

  //validation

  if (
    [fullname, email, username, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All Fields are Required");
  }

  //validation 2
  //either the email or password that we are entering is in the database or not
  //here we are accessing from the database so we need to use asyc await actually async used before creating function so here we can use await
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  }); //it will return boolean value
  if (existedUser) {
    throw new ApiError(409, "User Already Exist");
  }
  //uploading local path file to cloudinary
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(409, "there is no localpath for avatar");
  }

  // const avatar=await uploadOnCloudinary(avatarLocalPath)
  // let coverImage=''
  // if(coverLocalPath){
  //     coverImage=uploadOnCloudinary(coverLocalPath)
  // }--this is first method

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded");
  } catch (error) {
    console.log("Error Uploading Avatar", error);
    throw new ApiError(500, "Failed to Upload avatar");
  }
  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Cover Image uploaded");
  } catch (error) {
    console.log("Error Uploading Avatar", error);
    throw new ApiError(500, "Failed to Upload Cover Image");
  }

  //creating on database if request came
  try {
    const user = await User.create({
      fullname,
      avatar: avatar?.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });
    //actually we are created here instead of console logging this we can call from db so that here we can get info about user is added
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(500, "Something Went Wrong while Registering");
    }
    ///checking from the postman
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
  } catch (error) {
    console.log("User Creation Failed");
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
      throw new ApiError(500, "avatar and coverImage was deleted");
    }
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
    //may come error use updqate and unset
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true } // to update the result back
  ); // this removes the refresh token from the database
  } catch (error) {
    console.log(error)
  }

  const options = {
    httpOnly: true,
    secure: (process.env.NODE_ENV = "production"),
  }; // this is used to write for cookies

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  //validation-1
  if ([email, username, password].some((field) => field?.trim() == "")) {
    throw new ApiError(404, "All Fields Are Required");
  }
  //validation-2 {we are checking wheather the entered details are in the database or not}
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(500, "User Not Found");
  }

  //validation-3 {password validation}
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(500, "Invalid Password");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //accessing logged in user details from the database
  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  //checking if the logged in user is ther or not there
  if (!loggedInUser) {
    throw new ApiError(401, "There is no Such User Existed");
  }
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user successfully logged in"
      )
    );
});


//here u need to perform refresh token only when you login the user then only refreshtoken will work
const refreshAccessToken = asyncHandler(async (req, res) => {
  //generally we should call the refreshtoken from the cookie that where we have saved it
  const incomingRefreshToken = req.cookies.refreshToken;
  // if (!incomingRefreshToken) {
  //   throw new ApiError(401, "Refresh Token Is required");
  // }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // console.log(decodedToken);
    //after verifing token get user using decoded token
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    //generating new access token and refresh token
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    user.save({ validateBeforeSave: false });
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Generated Successfully"
        )
      );
  } catch (error) {
    // throw new ApiError(500, "Something Went Wrong during Refreshing tokens");
    console.log(error);
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordValid = user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(404, "Old password is Incorrect");
  }
  //there is a pre hook that which changes the password into an hash password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(201)
    .json(new ApiResponse(201, req.user, "Cuurent user Details"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname && !email) {
    throw new ApiError(400, "Fullname and email are");
  }
  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email: email.toLowerCase(),
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(201)
    .json(new ApiResponse(200, user, "Account Updated Succesfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(404, "File is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(404, "Something Went Wrong while uploading avatar");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res.status(201).json(new ApiResponse(201, "Avatar Uploaded Successfully"));
});
const updateUsercoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalpath = req.file?.path;
  if (!coverLocalPath) {
    throw new ApiError(404, "File is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalpath);
  if (!coverImage.url) {
    throw new ApiError(404, "Something Went Wrong while uploading coverImage");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(201)
    .json(new ApiResponse(201, "CoverImage Uploaded Successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params; //first u need to get username from the url to check his profile

  if (!username.trim()) {
    throw new ApiError(404, "Username is required");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel", //means we are checking wheather the id is there in the channel if it is there then he is the subscriber of your channel
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedTocount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
        $cond: {
          if: { $in: [req.user?._id, "$subscribers.subscriber"] }, //condition checking wheather user id is there  in the subscriber or not
          then: true,
          else: false,
        },
      },
      },
    },
    {
      $project: {
        fullname: 1,
        email: 1,
        username: 1,
        avatar: 1,
        subscribersCount: 1,
        channelSubscribedTocount: 1,
        isSubscribed: 1,
        coverImage: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "Channel not found");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, channel[0], "channel profile fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory", //here we are finding from videos that in that video our watch history is contained or not
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, user[0]?.watchHistory),
      "watch history fetched successfully"
    );
}); //u can get clarity from chat gpt

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  updateUserAvatar,
  updateUsercoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
