import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/:senderId/:receiverId", getMessages);

// API lấy tin nhắn cuối cùng giữa hai người dùng
router.get("/lastMessage/:userId/:contactId", async (request, response) => {
    try {
        const { userId, contactId } = request.params;

        if (!userId || !contactId) {
            return response
                .status(400)
                .json({ message: "Thiếu userId hoặc contactId" });
        }

        console.log(
            "Truy vấn lastMessage với userId:",
            userId,
            "và contactId:",
            contactId
        );

        const lastMessage = await Message.find({
            $or: [
                { sender: userId, receiver: contactId },
                { sender: contactId, receiver: userId },
            ],
        })
            .sort({ timestamp: -1 })
            .limit(1)
            .populate("sender", "name avatar")
            .populate("receiver", "name avatar");

        if (!lastMessage || lastMessage.length === 0) {
            return response
                .status(404)
                .json({ message: "Không tìm thấy tin nhắn cuối cùng" });
        }

        response.status(200).json(lastMessage[0]);
    } catch (error) {
        console.error("Lỗi trong API lastMessage:", error.message);
        response
            .status(500)
            .send({ message: "Có lỗi xảy ra khi lấy tin nhắn cuối cùng." });
    }
});

router.post("/", sendMessage);

export default router;
