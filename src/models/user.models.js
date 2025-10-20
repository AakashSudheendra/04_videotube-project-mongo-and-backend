import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinaryUrl
      required: true,
    },
    coverImage: {
      type: String, //cloudinaryUrl
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
//middle wares dont use arrow function use async because it takes time to load from database or from user
//here we are doing password encryption
//everytime use next because it sends reutrn statement to either next middle ware or to database directly
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //this.password refers to userschema object
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//password checking if the user enter password is correct or not from database
//why we used asynch because we are fetching password from database (any time we fetch from databse use async)
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  // jwt.sign({objects},'secretcode',{expiry})
   return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
userSchema.methods.generateRefreshToken = function () {
  // jwt.sign({objects},'secretcode',{expiry})
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
