import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChangeAvatarModal = ({ isOpen, onClose, currentAvatar, onAvatarChange }) => {
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const userId = Cookies.get('customerId');
    const file = e.target.files[0];
    const fileExtension = file?.name.split('.').pop().toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (file && validExtensions.includes(fileExtension)) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append("avatar", file);

        try {
          // Gửi yêu cầu PUT lên server với avatar mới
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
          onAvatarChange(reader.result); // Cập nhật avatar trong UI ngay lập tức với giá trị mới
          onClose(); // Đóng modal
        } catch (error) {
          console.error("Error updating avatar", error);
          setError("Có lỗi xảy ra khi thay đổi ảnh đại diện");
        }
      };
      reader.readAsDataURL(file); // Đọc file ảnh
      setError('');
    } else {
      setError('Vui lòng chọn một file ảnh có định dạng .jpg, .jpeg, .png hoặc .gif');
    }
  };

  const handleRemoveAvatar = async () => {
    const userId = Cookies.get('userId')
    const formData = new FormData();
    formData.append("avatar", './public/avt_null.jpg'); // Cập nhật ảnh về avatar mặc định

    try {
      // Gửi yêu cầu PUT để cập nhật ảnh đại diện thành ảnh mặc định
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
      onAvatarChange('./public/avt_null.jpg'); // Cập nhật avatar trong UI
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Error removing avatar", error);
      setError("Có lỗi xảy ra khi gỡ ảnh đại diện");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    isOpen && (
      <div
        id="modal-overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50"
        onClick={handleOverlayClick}
      >
        <div className="bg-[rgb(24,26,27)] rounded-3xl w-full max-w-xl flex flex-col items-center">
          <h2 className="font-semibold text-white text-center text-[24px] p-6">Thay ảnh đại diện</h2>
          <img src={currentAvatar} alt="Current Avatar" className="w-32 h-32 rounded-full object-cover mb-7" />
          <div className="flex flex-col w-full items-center font-semibold text-[22px]">
            {/* Input file cho việc tải ảnh lên */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="w-full cursor-pointer border-t p-4 flex items-center justify-center"
              style={{ borderColor: 'rgb(73, 73, 73)' }}
            >
              <span className="w-full rounded text-center font-bold" style={{ color: "rgb(14, 160, 255)" }}>
                Tải ảnh lên
              </span>

            </label>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="w-full cursor-pointer border-t p-4 flex items-center justify-center font-bold" style={{ borderColor: 'rgb(73, 73, 73)' }}>
              <span
                className="w-full text-red-500 rounded text-center"
                onClick={handleRemoveAvatar}
              >
                Gỡ ảnh hiện tại
              </span>
            </div>

            <div className="w-full cursor-pointer border-t p-4 flex items-center justify-center" onClick={onClose} style={{ borderColor: 'rgb(73, 73, 73)' }}>
              <span className="w-full rounded text-center font-bold" style={{ color: "rgb(146, 146, 146)" }}>
                Đóng
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ChangeAvatarModal;
