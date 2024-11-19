import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
    {
        articleID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: true
        },
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reportTag:{
            type: String,
            required: false
        },
        reportDetail:{
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
export const Report = mongoose.model('Report', reportSchema);