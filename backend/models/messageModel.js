import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        messageDetail:{
            type: String,
            required: true
        },
        messageDate:{
            type: Date,
            required: true,
            default: Date.now
        },
        messageStatus:{
            type: String,
            required: true
        },
        senderID:{
            type: String,
            required: true
        },
        receiverID:{
            type: String,
            required: true
        }
    }
);
export const Message = mongoose.model('Message', messageSchema);