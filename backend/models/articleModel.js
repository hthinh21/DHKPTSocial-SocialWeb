import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
    {
        description:{
            type: String,
            required: true
        },
        publishDate:{
            type: Date,
            default: Date.now,
            required: true,
        },
        articleStatus:{
            type: String,
            default: "active",
            required: true
        },
        numberOfComment:{
            type: Number,
            default: 0,
            required: true
        },
        numberOfLike:{
            type: Number,
            default: 0,
            required: true
        },
        userID:{
            type: String,
            required: true
        }
    }
);
export const Article = mongoose.model('Article', articleSchema);