import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
    {
        articleID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: false
        },
        commentID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required: false
        },
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reportType:{
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