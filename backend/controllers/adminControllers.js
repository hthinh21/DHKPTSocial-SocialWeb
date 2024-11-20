import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import { Article } from "../models/articleModel.js";
import { Comment } from "../models/commentModel.js";
import { Report } from "../models/reportModel.js";

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    if (password !== admin.password) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    return res.status(200).json({
      message: "Đăng nhập thành công",
      userId: admin._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật trạng thái thành công", user });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};

export const getPostReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportType: "article" })
      .populate("articleID")
      .populate("userID")
      .populate("reportDetail");
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo bình luận:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};

export const updatePostStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const post = await Article.findByIdAndUpdate(id, { status }, { new: true });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái bài viết:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};

export const getCommentReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportType: "comment" })
      .populate("commentID")
      .populate("userID")
      .populate("reportDetail");
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo bình luận:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};

export const updateCommentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { commentStatus: status },
      { new: true }
    );
    res.status(200).json({
      message: "Cập nhật trạng thái thành công.",
      comment,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái bình luận:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi" });
  }
};
