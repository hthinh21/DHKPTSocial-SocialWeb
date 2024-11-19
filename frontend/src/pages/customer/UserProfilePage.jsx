import React, { useEffect, useState } from "react";
import setting from '../../assets/setting.png';
import activity_1 from '../../assets/activity_1.png';
import activity_2 from '../../assets/activity_2.png';
import bookmark_1 from '../../assets/bookmark_1.png';
import bookmark_2 from '../../assets/bookmark_2.png';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Avatar } from "@chakra-ui/react";
import Spiner from "../../components/Spiner";
import FollowersModal from "../../components/FollowersModal";
import FollowingsModal from "../../components/FollowingsModal";

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' Tr'; // Ví dụ: 1200000 -> 1.2 Tr
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + ' N'; // Ví dụ: 11000 -> 11 N
  } else {
    return num.toLocaleString(); // Hiển thị số bình thường cho các giá trị nhỏ hơn 10,000
  }
};

const UserAccount = () => {
  // const { posts } = PostData();
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [description, setDescription] = useState("");
  const [activeSection, setActiveSection] = useState('posts');
  const [followed, setFollowed] = useState(true);
  // const [visiblePosts, setVisiblePosts] = useState(12); // Khởi tạo với 12 bài viết
  const [loading, setLoading] = useState(true); 
  const [loadingFollow, setLoadingFollow] = useState(false); 
  // const [loadedAll, setLoadedAll] = useState(false); // Trạng thái kiểm tra đã tải hết hay chưa
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [isChangeAvatarModalOpen, setIsChangeAvatarModalOpen] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const enqueueSnackbar = useSnackbar();
  const userId = Cookies.get("customerId");
  const params = useParams();
  const navigate = useNavigate();

  function fetchUser() {
    setLoading(true);
    try {
      axios.get(`http://localhost:1324/users/${params.id}`)
      .then((response) => {
        setUser(response.data);
        setUsername(response.data.username);
        setDescription(response.data.description);
        setAvatar(response.data.avatar);
        setName(response.data.name);
        if (response.data.followers.length == 0 || !response.data.followers.some(follower => follower._id === Cookies.get("customerId"))) setFollowed(false);
        setLoading(false);
        setLoadingFollow(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  

  // const { followUser } = UserData();

  // const followHandler = () => {
  //   setFollowed(!followed);
  //   followUser(user._id, fetchUser);
  // };

  const followHandler = () => {
    setLoadingFollow(true)
    try {
      axios.post(`http://localhost:1324/users/follow/${params.id}`, 
        {loggedInUserId: userId},
        { withCredentials: true } // gửi với token
      )
      .then((response) => {
        if(followed){
          const notify = {
            user: params.id,
            actor: Cookies.get('customerId')
          };
          axios.delete('http://localhost:1324/notifications', { data: notify })
          .then((response) => {
            setFollowed(!followed);
            fetchUser();
          });
        }
        else if(!followed){
          const notification = {
            user: params.id,
            actor: Cookies.get('customerId'),
            actionDetail: 'đã theo dõi bạn',
          };
          axios.post('http://localhost:1324/notifications', notification)
          .then((response) => {
            setFollowed(!followed);
            fetchUser();
          });
        }
      });
      
      

    } catch (error) {
      console.log(error);
      setLoadingFollow(false);
    }
  };

  

  useEffect(() => {
    
    if (params.id === userId) {
      navigate('/home');
    }
  }, [user]);

  async function followData() {
    try {
      const { data } = await axios.get(`http://localhost:1324/users/followdata/${params.id}`,
      {withCredentials: true}
      );
      setFollowersData(user.followers.length);
      setFollowingsData(user.followings.length);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    followData();
  }, [user]);

  return (
    
      <div className="container mx-auto p-5 bg-black" >
        <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-start">
          {/* Profile Information */}
          <div className="w-full lg:w-[500px] h-[300px] relative flex justify-center items-center">
            <div className="w-[200px] h-[200px] flex justify-center items-center">
              <Avatar size="2xl" className="w-full h-full rounded-full object-cover" src={`http://localhost:1324/files/download/${avatar}`}  alt="profile" onClick={() => setIsChangeAvatarModalOpen(true)} />
            </div>
          </div>

          {/* Profile Details */}
          <div className="w-full lg:w-[1080px] flex flex-col items-center lg:items-start gap-5 mt-5 lg:mt-0">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start  lg:items-start gap-5">
              <div className="text-white text-3xl font-semibold items-center flex h-full" style={{ lineHeight: '54px' }}>{username}</div> 
              {user._id !== userId && (  
                <button
                  onClick={followHandler}
                  disabled={loadingFollow}
                  className={`h-12 w-24 text-white rounded-md ${
                     followed ? "bg-red-500" : "bg-blue-400"
                  }`}
                >
                  {loadingFollow ? (
                    <Spiner/>
                  ): (
                    followed ? "UnFollow" : "Follow"
                  )}
                </button>
              )}                    
            </div>
            

            {/* Stats */}
            <div className="flex gap-5 text-center lg:text-left">
              <div className="flex flex-row items-center cursor-pointer">
                <span className="text-white text-xl">{formatNumber(user.posts ? user.posts.length : 0)} bài viết</span>
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
              followers={user.followersList}
            />
             <FollowingsModal
              isOpen={isFollowingModalOpen}
              onClose={() => setIsFollowingModalOpen(false)}
              followings={user.followingsList}/> */}

            {/* User Bio */}
            <div className="text-center lg:text-left" style={{ fontSize: '20px' }}>
              <div className="text-white font-semibold text-[24px]">{name}</div>
              <div className="text-white text-[24px]">{description}</div>
            </div>
          </div>
        </div>
      
      {/* Header Section */}
      

      {/* Divider */}
      <div className="w-full h-1 bg-gray-700 my-5"></div>

      {/* Tab Section */}
      <div className="flex flex-col gap-5 mb-5">
        <div className="justify-center items-center gap-[59px] inline-flex">
          <div 
            className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'posts' ? 'text-white' : 'text-[#949696]'}`}
            onClick={() => {
              setActiveSection('posts');
              // setVisiblePosts(12); // Reset số bài viết khi chuyển tab
              // setLoadedAll(false); // Reset trạng thái đã tải hết
            }}
          >
            <img src={activeSection === 'posts' ? activity_1 : activity_2} alt="Post icon" className="w-5 h-5 mr-1" style={{ width: '30px', height: '30px' }} />
            <div className="text-[20px] font-semibold">BÀI VIẾT</div>
          </div>
          <div 
            className={`justify-center items-center gap-1 flex cursor-pointer ${activeSection === 'bookmarks' ? 'text-white' : 'text-[#949696]'}`}
            onClick={() => {
              setActiveSection('bookmarks');
              // setVisiblePosts(12); // Reset số bài đã lưu khi chuyển tab
              // setLoadedAll(false); // Reset trạng thái đã tải hết
            }}
          >
            <img src={activeSection === 'bookmarks' ? bookmark_2 : bookmark_1} alt="Bookmark icon" className="w-5 h-5 mr-1" style={{ width: '30px', height: '30px' }} />
            <div className="text-[20px] font-semibold">ĐÃ LƯU</div>
          </div>
        </div>
        </div>
      </div>
  );
};



export default UserAccount;