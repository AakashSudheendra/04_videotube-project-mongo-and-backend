import { Router } from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  updateAccountDetails,
  updateUserAvatar,
  updateUsercoverImage,
  getWatchHistory,
} from "../controllers/user.conntrollers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
//unsecured routes
router.route("/login").post(loginUser);
router.route("/refreshtoken").post(refreshAccessToken);

//secured Routes
router.route("/logout").post(verifyJWT, logoutUser); //lets explain about next if jwt token verified next() helps to send access to logout user file so thats why next is used
router.route("/changePassword").post(verifyJWT, changeCurrentPassword);
router.route("/getcurrentUser").get(verifyJWT, getCurrentUser);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/updateAccountDetails").patch(verifyJWT, updateAccountDetails);
router
  .route("/updateAvatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/updateCoverimage")
  .patch(verifyJWT, upload.single("coverImage"), updateUsercoverImage);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
