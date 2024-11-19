import mongoose from "mongoose";

const notifySchema = mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        actor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        actionDetail:{
            type: String,
            required: true
        },
        article:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
            required: false
        },
        actionDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        likeID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like",
            required: false
        },
        commentID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: false
        }
    }
);
export const Notify = mongoose.model('Notify', notifySchema);