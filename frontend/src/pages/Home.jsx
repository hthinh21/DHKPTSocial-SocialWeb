import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomePage from './customer/HomePage'
import SearchPage from './customer/SearchPage'
import MessagePage from './customer/MessagesPage'
import NotificationPage from './customer/NotificationsPage'
import ProfilePage from './customer/ProfilePage'
import SettingPage from './customer/SettingPage';
import CreatePost from './customer/CreatePost';
import Cookies from 'js-cookie';
import LogoSvg from '../components/svgs/DHKPTSocial';
import { FaHome, FaSearch, FaFacebookMessenger, FaUserCircle, FaBell  } from "react-icons/fa";
import { IoIosAddCircle,IoIosSettings  } from "react-icons/io";
import { useSnackbar } from 'notistack';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [inCreate, setCreate] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCreate(false);
  };

  const handleCreate = () => {
    if (!inCreate) {
      setCreate(true);
      setActiveTab('create');
    }
  };

  useEffect(() => {
    const id = Cookies.get('customerId');
    const name = Cookies.get('customerName');
    if (id === undefined && name === undefined) {
      navigate('/login');
      enqueueSnackbar('Hãy đăng nhập', { variant: 'error' });
    }
  }, [navigate, enqueueSnackbar]);

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: FaHome },
    { id: 'search', label: 'Tìm kiếm', icon: FaSearch },
    { id: 'message', label: 'Tin nhắn', icon: FaFacebookMessenger },
    { id: 'notification', label: 'Thông báo', icon: FaBell },
    { id: 'profile', label: 'Trang cá nhân', icon: FaUserCircle },
    { id: 'create', label: 'Tạo bài viết', icon: IoIosAddCircle },
  ];
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-600">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/90 backdrop-blur-sm md:block hidden">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-8">
              <LogoSvg className="w-8 h-8" />
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.id === 'create' ? handleCreate() : handleTabChange(item.id)}
                  className={`
                    w-full px-4 py-3 flex items-center space-x-3 rounded-lg
                    transition-all duration-200 ease-in-out
                    ${activeTab === item.id ? 
                      'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg shadow-pink-500/20' : 
                      'text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon className={`text-xl ${activeTab === item.id ? 'text-pink-300' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={() => handleTabChange('setting')}
            className="absolute bottom-4 left-4 right-4 px-4 py-3 flex items-center space-x-3 rounded-lg
              text-gray-300 hover:bg-white/10 transition-all duration-200 ease-in-out"
          >
            <IoIosSettings className="text-xl text-gray-400" />
            <span className="font-medium">Cài đặt</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="md:ml-64 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="md:pb-2 pb-24">
              {activeTab === 'home' && <HomePage />}
              {activeTab === 'search' && <SearchPage />}
              {activeTab === 'message' && <MessagePage />}
              {activeTab === 'notification' && <NotificationPage />}
              {activeTab === 'profile' && <ProfilePage />}
              {activeTab === 'setting' && <SettingPage />}
              {inCreate && <CreatePost />}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm py-2 px-4 flex justify-around sm:justify-evenly md:justify-center lg:justify-around md:hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.id === 'create' ? handleCreate() : handleTabChange(item.id)}
            className={`
              flex flex-col items-center space-y-1 rounded-lg px-3 py-2
              transition-all duration-200 ease-in-out
              ${activeTab === item.id ? 
                'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg shadow-pink-500/20' : 
                'text-gray-300 hover:bg-white/10'
              }
            `}
          >
            <item.icon className={`text-xl ${activeTab === item.id ? 'text-pink-300' : 'text-gray-400'}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => handleTabChange('setting')}
          className={`
            flex flex-col items-center space-y-1 rounded-lg px-3 py-2
            transition-all duration-200 ease-in-out
            ${activeTab === 'setting' ? 
              'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg shadow-pink-500/20' : 
              'text-gray-300 hover:bg-white/10'
            }
          `}
        >
          <IoIosSettings className="text-xl text-gray-400" />
          <span className="text-xs font-medium">Cài đặt</span>
        </button>
      </div>
    </div>
    

    
  )
}

export default Home