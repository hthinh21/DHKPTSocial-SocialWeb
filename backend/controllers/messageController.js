import Message from "../models/Message.js";
// Lấy tin nhắn giữa hai người dùng
export const getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, sender: senderId },
            ],
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy tin nhắn" });
    }
};

// Gửi tin nhắn mới
export const sendMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;
    try {
        const newMessage = new Message({
            sender,
            receiver,
            content,
            timestamp: new Date(),
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi gửi tin nhắn" });
    }
};
