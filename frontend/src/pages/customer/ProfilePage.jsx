import { useState, useEffect } from 'react';
import img1 from '../../assets/img_1.jpg';
import img2 from '../../assets/img_2.jpg';
import img3 from '../../assets/img_3.jpg';
import img4 from '../../assets/img_4.jpg';
import img5 from '../../assets/img_5.jpg';
import img6 from '../../assets/img_6.jpg';
import img7 from '../../assets/img_7.jpg';
import img8 from '../../assets/img_8.jpg';
// import avatar from '../../assets/avt.jpg';
import activity_1 from '../../assets/activity_1.png';
import activity_2 from '../../assets/activity_2.png';
import bookmark_1 from '../../assets/bookmark_1.png';
import bookmark_2 from '../../assets/bookmark_2.png';
import heart from '../../assets/heart.png';
import comment from '../../assets/comment.png';
import setting from '../../assets/setting.png';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ChangeAvatarModal from '../../components/ChangeAvatarModal';
import FollowersModal from '../../components/FollowersModal';
import FollowingsModal from '../../components/FollowingsModal';
import { Avatar } from '@chakra-ui/react';

const posts = [
  { image: img1, likes: 474000, comments: 24000 },
  { image: img2, likes: 1200000, comments: 45293 },
  { image: img3, likes: 567237, comments: 56200 },
  { image: img4, likes: 362478, comments: 24888 },
  { image: img5, likes: 1340753, comments: 6782 },
  { image: img6, likes: 568328, comments: 550 },
  { image: img7, likes: 28892, comments: 7535 },
  { image: img8, likes: 562883, comments: 16243 },
  { image: img1, likes: 474000, comments: 24000 },
  { image: img2, likes: 1200000, comments: 45293 },
  { image: img3, likes: 567237, comments: 56200 },
  { image: img4, likes: 362478, comments: 24888 },
  { image: img5, likes: 1340753, comments: 6782 },
  { image: img6, likes: 568328, comments: 550 },
  { image: img7, likes: 28892, comments: 7535 },
  { image: img8, likes: 562883, comments: 16243 },
  { image: img1, likes: 474000, comments: 24000 },
  { image: img2, likes: 1200000, comments: 45293 },
  { image: img3, likes: 567237, comments: 56200 },
  { image: img4, likes: 362478, comments: 24888 },
  { image: img5, likes: 1340753, comments: 6782 },
  { image: img6, likes: 568328, comments: 550 },
  { image: img7, likes: 28892, comments: 7535 },
  { image: img8, likes: 562883, comments: 16243 },
];

const bookmarks = [
  { image: img2, likes: 474000, comments: 24000 },
  { image: img1, likes: 250000, comments: 45293 },
  { image: img3, likes: 567237, comments: 56200 },
  { image: img3, likes: 362478, comments: 24888 },
  { image: img6, likes: 1340753, comments: 6782 },
  { image: img8, likes: 568328, comments: 3550 },
];

// const user = [
//   {
//     avatar:'../../assets/avt.jpg' ,
//     name: 'fourth.ig',
//     fullname: 'Nattawat Jirochtikul',
//     bio: [
//       '@numone_official',
//       '🐾 @munmuang.ig',
//       '0639796424, 026699079',
//       'GMMTVARTISTS@GMAIL.COM',
//     ],
//     posts: 497,
//     followers: 3500000,
//     following: 1006
//   },
// ];

// Hàm định dạng số lượng theo dõi
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' Tr'; // Ví dụ: 1200000 -> 1.2 Tr
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + ' N'; // Ví dụ: 11000 -> 11 N
  } else {
    return num.toLocaleString(); // Hiển thị số bình thường cho các giá trị nhỏ hơn 10,000
  }
};

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [activeSection, setActiveSection] = useState('posts');
  const [visiblePosts, setVisiblePosts] = useState(12); // Khởi tạo với 12 bài viết
  const [loading, setLoading] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false); // Trạng thái kiểm tra đã tải hết hay chưa
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [isChangeAvatarModalOpen, setIsChangeAvatarModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false); // Thay đổi tên cho rõ ràng
  const [isFollowingsModalOpen, setIsFollowingsModalOpen] = useState(false); // Modal cho Đang theo dõi
  // const [previewAvatar, setPreviewAvatar] = useState(null);
  const enqueueSnackbar = useSnackbar();
  const userId = Cookies.get("customerId");

  const handleLoadMorePosts = () => {
    if (!loading && !loadedAll) {
      setLoading(true);
      setTimeout(() => {
        if (visiblePosts < (activeSection === 'posts' ? posts.length : bookmarks.length)) {
          setVisiblePosts((prev) => prev + 12);
        } else {
          setLoadedAll(true); // Đánh dấu đã tải hết
        }
        setLoading(false);
      }, 1000); // Thời gian giả lập tải
    }
  };
  async function followData() {
    try {
      const { data } = await axios.get(`http://localhost:1324/users/${userId}`, {
        withCredentials: true, // hoặc dùng headers nếu cần thêm token
      });     
      setFollowersData(data.followers.length);
      setFollowingsData(data.followings.length);
    } catch (error) {
      console.log(error);
      console.log("Error fetching user data", error);
    }
  }

  const { id } = useParams();
  useEffect(() => {
    console.log(id);
    
      const fetchUserData = async () => {
        if (!userId) return;
  
        try {
          const response = await axios.get(
            `http://localhost:1324/users/${userId}`
          );
          const user = response.data;
          console.log("User Data:", user);
          setUsername(user.username);
          setDescription(user.description);
          setAvatar(user.avatar);
          setName(user.name);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };
  
      fetchUserData();
      followData();
  
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        handleLoadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, visiblePosts, loadedAll, userId]); 
  
  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
    updateAvatar(newAvatar)
  };
  const updateAvatar = async (newAvatar) => {
    try {
      const userId = Cookies.get('userId'); 
      const formData = new FormData();
      formData.append("avatar", newAvatar); 
  
      const response = await axios.put(
        `http://localhost:1324/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      enqueueSnackbar('Thêm ảnh thành công', {variant : 'success'})
    } catch (error) {
      console.error("Error updating avatar", error);
    }
  };
  return (
    <div className="container mx-auto p-5 bg-black" >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-start">
        {/* Profile Information */}
        <div className="w-full lg:w-[500px] h-[300px] relative flex justify-center items-center">
          <div className="w-[200px] h-[200px] flex justify-center items-center">
            <Avatar size='2xl' className="w-full h-full rounded-full object-cover" src={`http://localhost:1324/files/download/${avatar}`}  alt="profile" onClick={() => setIsChangeAvatarModalOpen(true)} />
          </div>
        </div>

        {/* Profile Details */}
        <div className="w-full lg:w-[1080px] flex flex-col items-center lg:items-start gap-5 mt-5 lg:mt-0">
          <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-center lg:items-start gap-5">
            <div className="text-white text-3xl font-semibold items-center flex h-full" style={{ lineHeight: '54px' }}>{username}</div>
            <button className="p-3 bg-[#212425] rounded-lg text-white hover:bg-[#3a3d40]" style={{ fontSize: '22px' }}>
            <Link to ={`/edit/${userId}`}>
              Chỉnh sửa trang cá nhân
            </Link>
            
            </button>
            <img src={setting} className="w-5 h-5 mr-1 cursor-pointer" style={{ width: '50px', height: '50px' }} />
          </div>

          {/* Stats */}
          <div className="flex gap-5 text-center lg:text-left">
            <div className="flex flex-row items-center cursor-pointer">
              <span className="text-white text-xl">0 bài viết</span>
            </div>
            <div className="flex flex-row items-center cursor-pointer">
              <span className="text-white text-xl">{formatNumber(followersData)} người theo dõi</span>
            </div>
            <div className="flex flex-row items-center cursor-pointer">
              <span className="text-white text-xl" >Đang theo dõi {formatNumber(followingsData)} người dùng</span>
            </div>
          </div>

          {/* Modals */}
          {/* <FollowersModal
            isOpen={isFollowersModalOpen}
            onClose={() => setIsFollowersModalOpen(false)}
            followers={followersData.followersList}
          />

          <FollowingsModal
            isOpen={isFollowingsModalOpen}
            onClose={() => setIsFollowingsModalOpen(false)}
            followings={followingsData.followingsList}
          /> */}
          <ChangeAvatarModal
            isOpen={isChangeAvatarModalOpen}
            onClose={() => setIsChangeAvatarModalOpen(false)}
            currentAvatar={`data:image/jpeg;base64,${avatar}`} // Pass the current avatar to the modal
            onAvatarChange={handleAvatarChange} // Hàm xử lý thay đổi avatar
          />

          {/* User Bio */}
          <div className="text-center lg:text-left" style={{ fontSize: '20px' }}>
            <div className="text-white font-semibold text-[24px]">{name}</div>
            <div className="text-white text-[24px]">{description}</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-1 bg-gray-700 my-5"></div>

      {/* Tab Section */}
      <div className="flex flex-col gap-5 mb-5">
        <div className="justify-center items-center gap-[59px] inline-flex">
          <div 
            className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'posts' ? 'text-white' : 'text-[#949696]'}`}
            onClick={() => {
              setActiveSection('posts');
              setVisiblePosts(12); // Reset số bài viết khi chuyển tab
              setLoadedAll(false); // Reset trạng thái đã tải hết
            }}
          >
            <img src={activeSection === 'posts' ? activity_1 : activity_2} alt="Post icon" className="w-5 h-5 mr-1" style={{ width: '30px', height: '30px' }} />
            <div className="text-[20px] font-semibold">BÀI VIẾT</div>
          </div>
          <div 
            className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'bookmarks' ? 'text-white' : 'text-[#949696]'}`}
            onClick={() => {
              setActiveSection('bookmarks');
              setVisiblePosts(12); // Reset số bài đã lưu khi chuyển tab
              setLoadedAll(false); // Reset trạng thái đã tải hết
            }}
          >
            <img src={activeSection === 'bookmarks' ? bookmark_2 : bookmark_1} alt="Bookmark icon" className="w-5 h-5 mr-1" style={{ width: '30px', height: '30px' }} />
            <div className="text-[20px] font-semibold">ĐÃ LƯU</div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="flex justify-center lg:justify-start gap-2 flex-wrap">
  {(activeSection === 'posts' ? posts : bookmarks).slice(0, visiblePosts).map((post, index) => (
    <div key={index} className="relative w-[365px] h-[365px] group">
      <img src={post.image} alt={`Post ${index}`} className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-row gap-3">
          <div className="flex items-center">
            <img src={heart} alt="Likes" className="w-5 h-5 mr-1" style={{ width: '30px', height: '30px' }}/>
            <span className="text-[20px] font-semibold">{formatNumber(post.likes)}</span>
          </div>
          <div className="flex items-center">
            <img src={comment} alt="Comments" className="w-5 h-5 mr-1" style={{ width: '30px', height: '30px' }}/>
            <span className="text-[20px] font-semibold">{formatNumber(post.comments)}</span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* Loading Indicator */}
        {loading && <div className="text-center text-white text-[20px] font-semibold">Đang tải...</div>}
        {!loadedAll && !loading && (
          <button
            onClick={handleLoadMorePosts}
            className="w-full p-3 bg-[#0077c5] rounded-lg text-white hover:bg-[#005ea3]"
          >
            Tải thêm bài viết
          </button>
        )}
        {loadedAll && <div className="text-center text-white text-[20px] font-semibold">Đã tải hết bài viết.</div>}
      </div>
    </div>
  );
};

export default ProfilePage;
