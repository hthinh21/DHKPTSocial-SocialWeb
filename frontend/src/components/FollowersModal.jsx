import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';  // Nhập PropTypes
import cancel from '../assets/cancel.png';

const FollowersModal = ({ isOpen, onClose, followers }) => {
  // if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFollowers, setFilteredFollowers] = useState(followers);

  const handleCloseOutside = (e) => {
    // Kiểm tra nếu bấm ra ngoài modal thì sẽ đóng modal
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  // Tìm kiếm người theo dõi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        const filtered = followers.filter((follower) =>
          follower.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFollowers(filtered);
      } else {
        setFilteredFollowers(followers);
      }
    }, 1000); // Tìm kiếm sau 1 giây không nhập

    return () => clearTimeout(timer); // Dọn dẹp timer khi unmount hoặc khi searchTerm thay đổi
  }, [searchTerm, followers]);

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
        <h2 className="text-center font-semibold mb-2 text-white text-[26px]">Người theo dõi</h2>
        <hr className="border-t border-white mb-3" /> {/* Đường gạch ngang màu trắng */}

        <div className="mb-3">
          <input
            type="text"
            placeholder="Tìm kiếm người theo dõi..."
            className="w-full p-2 rounded-lg text-[19px] bg-gray-200 text-black placeholder-gray-500" // Tăng sự bo góc và kích thước chữ
            value={searchTerm} // Liên kết với state
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị searchTerm
          />
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(40vh-55px)]"> {/* Cho phép cuộn */}
          {filteredFollowers.length === 0 ? ( // Kiểm tra xem có kết quả không
            <span className="text-gray-400 text-center text-[20px]">Không tìm thấy kết quả.</span>
          ) : (
            filteredFollowers.map((follower, index) => (
              <div key={index} className="flex items-center gap-3">
                <img src={follower.avatar} alt={follower.name} className="rounded-full" style={{ width: '60px', height: '60px' }} />
                <div className="flex flex-col">
                  <span className="text-white text-[20px]">{follower.name}</span>
                  <span className="text-gray-400">{follower.fullname}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


export default FollowersModal;
