import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(403).json({ message: "Không xác thực" });

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (!decodedData)
      return res.status(400).json({
        message: "Token hết hạn",
      });

    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    res.status(500).json({
      message: "Vui lòng đăng nhập lại",
    });
  }
};
