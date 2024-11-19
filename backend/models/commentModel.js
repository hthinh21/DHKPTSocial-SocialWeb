import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
    {
        articleID:{
            type: String,
            required: true
        },
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        commentDetail:{
            type: String,
            required: true
        },
        publishDate:{
            type: Date,
            required: true,
            default: Date.now
        }
    }
);
export const Comment = mongoose.model('Comment', commentSchema);