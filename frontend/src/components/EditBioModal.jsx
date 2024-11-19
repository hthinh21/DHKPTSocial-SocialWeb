import React, { useState } from 'react';

const EditBioModal = ({ isOpen, onClose, currentAvatar, currentName, currentFullName, currentBio, onOpenChangeAvatarModal, onBioChange }) => { 
  const [editableBio, setEditableBio] = useState(currentBio.join('\n')); // Khởi tạo state cho tiểu sử chỉnh sửa

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  const handleBioChange = (e) => {
    setEditableBio(e.target.value);
  };

  const handleSaveChanges = () => {
    onBioChange(editableBio); // Đảm bảo gọi đúng hàm từ props
    onClose();
  };

  return (
    isOpen && (
      <div
        id="modal-overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50"
        onClick={handleOverlayClick}
      >
        <div className="bg-[rgb(24,26,27)] rounded-3xl w-full max-w-3xl px-4 flex flex-col items-center">
          <h2 className="font-semibold text-white text-center text-[24px] p-6">Chỉnh sửa trang cá nhân</h2>
          
          <div className="flex items-center w-full justify-between p-4 bg-[rgb(33,36,37)] rounded-3xl">
            {/* Avatar và thông tin người dùng bên trái */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img src={currentAvatar} alt="Current Avatar" className="w-32 h-32 rounded-full object-cover cursor-pointer" onClick={onOpenChangeAvatarModal} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white text-[24px] font-semibold">{currentName}</span>
                <span className="text-gray-400 text-[20px] font-semibold">{currentFullName}</span>
              </div>
            </div>

            {/* Nút đổi ảnh bên phải */}
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-[20px] font-semibold"
              onClick={onOpenChangeAvatarModal} // Sử dụng hàm chuyển đổi modal
            >
              Thay đổi ảnh
            </button>
          </div>

          {/* Thẻ Tiểu sử */}
          <span className="text-white text-[22px] font-semibold mt-4">Tiểu sử</span>

          {/* Khung nhập cho Tiểu sử */}
          <textarea
            className="w-full max-h-32 mt-2 p-4 bg-[rgb(33,36,37)] text-white text-[20px] rounded-2xl resize-none overflow-y-auto
             border border-gray-600 focus:border-gray-400 focus:outline-none"
            rows="4"
            value={editableBio} // Sử dụng state `editableBio`
            onChange={handleBioChange} // Hàm để cập nhật tiểu sử khi chỉnh sửa
            spellCheck="false"
          />

          {/* Nút Lưu Thay Đổi */}
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-[20px] font-semibold my-4" 
            onClick={handleSaveChanges}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    )
  );
};

export default EditBioModal;
