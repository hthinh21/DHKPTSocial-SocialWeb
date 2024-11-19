import React, { useState, useEffect } from 'react';
import cancel from '../assets/cancel.png';

const FollowingsModal = ({ isOpen, onClose, followings }) => {
  // if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFollowings, setFilteredFollowings] = useState(followings);

  const handleCloseOutside = (e) => {
    // Kiểm tra nếu bấm ra ngoài modal thì sẽ đóng modal
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  // Tìm kiếm người đang theo dõi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        const filtered = followings.filter((following) =>
          following.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFollowings(filtered);
      } else {
        setFilteredFollowings(followings);
      }
    }, 1000); // Tìm kiếm sau 1 giây không nhập

    return () => clearTimeout(timer); // Dọn dẹp timer khi unmount hoặc khi searchTerm thay đổi
  }, [searchTerm, followings]);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur"
      onClick={handleCloseOutside}
    >
      <div
        className="relative p-5 w-full max-w-lg h-[calc(40vh+90px)] rounded-lg" // Tăng chiều cao modal
        style={{ backgroundColor: 'rgb(23, 24, 26)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={cancel}
          className="absolute top-4 right-2 w-5 h-5 mr-1 cursor-pointer"
          style={{ width: '40px', height: '40px' }}
          onClick={onClose}
        />
        <h2 className="text-center font-semibold mb-2 text-white text-[26px]">Đang theo dõi</h2>
        <hr className="border-t border-white mb-3" /> {/* Đường gạch ngang màu trắng */}        

        <div className="mb-3">
          <input
            type="text"
            placeholder="Tìm kiếm người đang theo dõi..."
            className="w-full p-2 rounded-lg text-[19px] bg-gray-200 text-black placeholder-gray-500" // Tăng sự bo góc và kích thước chữ
            value={searchTerm} // Liên kết với state
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị searchTerm
          />
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(40vh-55px)]"> {/* Cho phép cuộn */}
          {filteredFollowings.length === 0 ? ( // Kiểm tra xem có kết quả không
            <span className="text-gray-400 text-center text-[20px]">Không tìm thấy kết quả.</span>
          ) : (
            filteredFollowings.map((following, index) => (
              <div key={index} className="flex items-center gap-3">
                <img src={following.avatar} alt={following.name} className="rounded-full" style={{ width: '60px', height: '60px' }} />
                <div className="flex flex-col">
                  <span className="text-white text-[20px]">{following.name}</span>
                  <span className="text-gray-400">{following.fullname}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingsModal;
