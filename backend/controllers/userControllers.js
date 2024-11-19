import { User } from "../models/userModel.js";
import TryCatch from "../utils/Trycatch.js";
import generateToken from "../utils/generateToken.js";


export const searchUsers = TryCatch(async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm" });
  }

  const users = await User.find({
    $or: [
      { username: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  }).select("-password");

  res.json(users);
});
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(404).json({
      message: "Không có người dùng",
    });

  res.json(user);
});

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    
    user.username = req.body.username || user.username;
    user.description = req.body.description || user.description;
    if (req.file) {
      user.avatar = req.file.buffer.toString("base64"); // Lưu avatar từ buffer
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Cập nhật thông tin thành công", user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    
    if (password !== user.password) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }
    const token = generateToken(user._id, res);
    return res.status(200).json({
      message: "Đăng nhập thành công",  
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};
export const logoutUser = TryCatch((req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  res.json({
    message: "Đăng xuất thành công",
  });
});
export const userFollowerandFollowingData = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "-password")
    .populate("followings", "-password");

  const followers = user.followers;
  const followings = user.followings;

  res.json({
    followers,
    followings,
  });
});

export const followandUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.body.loggedInUserId); 
  if (!user) {
    return res.status(404).json({ message: "Không có người dùng với id này" });
  }

  if (!loggedInUser) {
    return res.status(404).json({ message: "Không có người dùng hiện tại" });
  }

  if (user._id.toString() === loggedInUser._id.toString()) {
    return res.status(400).json({ message: "Không thể theo dõi chính mình" });
  }

  if (user.followers.includes(loggedInUser._id)) {
    const indexFollowing = loggedInUser.followings.indexOf(user._id);
    const indexFollower = user.followers.indexOf(loggedInUser._id);

    loggedInUser.followings.splice(indexFollowing, 1);
    user.followers.splice(indexFollower, 1);

    await loggedInUser.save();
    await user.save();
    res.json({ message: "Đã hủy theo dõi" });
  } else {    
    loggedInUser.followings.push(user._id);
    user.followers.push(loggedInUser._id);
    await loggedInUser.save();
    await user.save();
    res.json({ message: "Đã theo dõi" });
  }
});
export const getNotifications = TryCatch(async (req, res) => {
  const notifications = await Notify.findById({ userId: req.user._id })
    .sort({ timestamp: -1 }) // Sắp xếp theo thời gian mới nhất
    

  if (!notifications || notifications.length === 0) {
    return res.status(404).json({ message: "Không có thông báo" });
  }

  res.json(notifications);
});