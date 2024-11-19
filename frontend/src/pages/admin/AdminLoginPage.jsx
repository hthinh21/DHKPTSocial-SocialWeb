import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 
import React, { useEffect, useState } from 'react'
import Spiner from '../../components/Spiner';
import LogoSvg from '../../components/svgs/DHKPTSocial';

const AdminLoginPage = () => {
    const [user, setUser] = useState('');
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    
    useEffect(() => {
      const id = Cookies.get('customerId');
      const name = Cookies.get('customerName');
      // console.log(id != undefined);
      // console.log(name != undefined);
      if(id != undefined || name != undefined) {
        navigate('/admin'); 
      }
    })
    const handleLogin = () => {
      setLoading(true);
      axios
        .post('http://localhost:1324/admin/login', { username, password }, { withCredentials: true }) 
        .then((response) => {
          const { userId, token } = response.data; 
          console.log("User ID:", userId);
          console.log("Token:", token);
  
          // Ghi cookie
          Cookies.set('token', token, { expires: 1 / 24, secure: true, sameSite: 'Strict' });
          Cookies.set('userId', userId, { expires: 1 / 24, secure: true, sameSite: 'Strict' });      

          enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
          navigate('/admin');
        })
        .catch((error) => {
          enqueueSnackbar(error.response?.data?.message || 'Đăng nhập thất bại', { variant: 'error' });
        })
        .finally(() => {
          setLoading(false);
        });
  };
return( 
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex">
      {/* Logo Section */}
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <div className="w-2/3 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white"><LogoSvg className='lg:w-2/3 fill-black' /></h1>
        </div>
      </div>

    {/* Login Form Section */}
    <div className="w-full lg:w-1/2 flex flex-col justify-center px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to continue to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                placeholder="Enter your password"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                className="text-sm font-semibold text-purple-600 hover:text-pink-600 transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            {/* Login Button */}
            <div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all hover:scale-105"
              >
                {loading ? <Spiner/> : 'Sign In'}
              </button>
            </div>   
          </div>
        </div>
      </div>
    </div>
  </div>
)
    
  
}

export default AdminLoginPage