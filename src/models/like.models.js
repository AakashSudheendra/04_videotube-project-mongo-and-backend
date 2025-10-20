import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    //either of video or comment or tweet will be assigned or otherwise null
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comments: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet",
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
