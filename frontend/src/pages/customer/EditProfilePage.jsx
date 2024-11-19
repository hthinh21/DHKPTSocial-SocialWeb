import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const EditProfilePage = () => {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const userId = Cookies.get("customerId");
  // const token = Cookies.get("token"); // Lấy token từ cookie

  useEffect(() => {  
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:1324/users/${userId}`
        );
        console.log(response.data);
        const user = response.data;
        setUsername(user.username);
        setEmail(user.email);
        setDescription(user.description);
        setAvatar(user.avatar);
                 
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("description", description);
    formData.append("userId", userId);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.put(
        `http://localhost:1324/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );
      console.log(response.data);
      alert("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Error updating user", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
      alert(errorMessage);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewAvatar(null);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Thay Đổi Thông Tin Cá Nhân</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Tên người dùng</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {avatar && !previewAvatar && (
          <div className="form-group">
            <label>Ảnh đại diện hiện tại:</label>
            <img
              src={`data:image/jpeg;base64,${avatar}`}
              alt="Avatar"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
          </div>
        )}

        {previewAvatar && (
          <div className="form-group">
            <label>Ảnh đại diện mới:</label>
            <img
              src={previewAvatar}
              alt="Avatar Preview"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="avatar">Thay đổi avatar</label>
          <input
            type="file"
            className="form-control"
            id="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-3">
            Lưu Thay Đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
