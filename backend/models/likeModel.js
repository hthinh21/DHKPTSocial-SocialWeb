import mongoose from "mongoose";

const likeSchema = mongoose.Schema(
    {
        articleID:{
            type: String,
            required: true
        },
        userID:{
            type: String,
            required: true
        },
        likeDate:{
            type: Date,
            required: true,
            default: Date.now
        }
    }
);
export const Like = mongoose.model('Like', likeSchema);