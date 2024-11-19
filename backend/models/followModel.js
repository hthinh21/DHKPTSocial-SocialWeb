import mongoose from "mongoose";

const followSchema = mongoose.Schema(
    {
        userID:{
            type: String,
            required: true
        },
        followingID:{
            type: String,
            required: true
        }
    }
);
export const Follow = mongoose.model('Follow', followSchema);