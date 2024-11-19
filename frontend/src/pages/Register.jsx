import React, { useState, useRef } from 'react';
import Spinner from '../components/Spiner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LogoSvg from '../components/svgs/DHKPTSocial';
import { FaUserAlt  } from "react-icons/fa";
import { Avatar } from '@chakra-ui/react';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop';
import { Camera, Upload } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarNow, setAvatarNow] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const imgRef = useRef(null);

  const handleAvatar = (e) => {
    setAvatar(e.target.files[0]);
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader();
        
        reader.onloadend = function() {
            const base64String = reader.result;
            setAvatarNow(base64String);
        };
        
        reader.readAsDataURL(file);
    } else {
        console.log("Không có file nào được chọn.");
    }
  }
  const isOver18 = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age >= 18;
  };
  function isValidText(username) {
    const lengthCheck = username.length >= 9 && username.length <= 20;
    const upperCaseCheck = /[A-Z]/.test(username);
    const lowerCaseCheck = /[a-z]/.test(username);
    const numberCheck = /[0-9]/.test(username);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(username);
  
    return lengthCheck && upperCaseCheck && lowerCaseCheck && numberCheck && specialCharCheck;
  }
  const handleRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(avatar === ''){
      enqueueSnackbar('Vui lòng thêm ảnh đại diện', {variant: 'warning'});
    }
    else if(name === ''){
      enqueueSnackbar('Thiếu tên người dùng', {variant: 'warning'});
    }
    else if(name.length < 8 || name.length > 20){
      enqueueSnackbar('Tên người dùng phải có độ dài từ 8 đến 20 ký tự', {variant: 'warning'});
    }
    else if(dob === ''){
      enqueueSnackbar('Thiếu ngày sinh', {variant: 'warning'});
    }
    else if(!isOver18(dob)){
      enqueueSnackbar('Người dùng đăng ký phải có độ tuổi từ 18 tuổi trở lên', {variant: 'warning'});
    }
    else if(email === ''){
      enqueueSnackbar('Thiếu email', {variant: 'warning'});
    }
    else if(!emailRegex.test(email)){
      enqueueSnackbar('Email sai định dạng', { variant: 'warning' });
    }
    else if(username === ''){
      enqueueSnackbar('Thiếu tên đăng nhập', {variant: 'warning'});
    }
    else if(!isValidText(username)){
      enqueueSnackbar('Tên đăng nhập phải gồm chữ hoa, chữ thường, số, ký tự đặc biệt và có độ dài lớn hơn 8, bé hơn 20 ký tự', {variant: 'warning'});
    }
    else if(password === ''){
      enqueueSnackbar('Thiếu mật khẩu', {variant: 'warning'});
    }
    else if(!isValidText(password)){
      enqueueSnackbar('Mật khẩu phải gồm chữ hoa, chữ thường, số, ký tự đặc biệt và có độ dài lớn hơn 8, bé hơn 20 ký tự', {variant: 'warning'});
    }
    else if(!(password === repassword)){
      enqueueSnackbar('Mật khẩu nhập lại không trùng khớp', { variant: 'error' });
    }
    else{
      const formDataAvatar = new FormData();
      formDataAvatar.append('avatar', avatar);
      setLoading(true);
      axios.post('http://localhost:1324/files/upload/avatar', formDataAvatar, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
      .then((response) => {
        console.log('Last file uploaded successfully:', response.data.file);
        console.log(response.data.file._id);
        const data = {
          username: username,
          password: password,
          name: name,
          dob: dob,
          email: email,
          avatar: response.data.file._id
        }
        axios.post('http://localhost:1324/users', data)
        .then((response) => {
          console.log(response.data)
          setLoading(false);
          enqueueSnackbar('Sign up successfully', { variant: 'success' });
          navigate('/login');
        })
      })
      }
    }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Join Our Community
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect with friends and the world around you
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => imgRef.current.click()}
                className="relative group cursor-pointer"
              >
                <div className={`h-24 w-24 rounded-full flex items-center justify-center 
                  ${avatar ? 'bg-gray-200' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                  {avatar ? (
                    <img
                      src={avatarNow}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={imgRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatar}
              />
              <p className="mt-2 text-sm text-gray-500">Upload your profile picture</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all hover:scale-105"
              >
                {loading ? <Spinner/> : 'Create Account'}
              </button>
            </div>

            <div className="text-sm text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link to={`/login`}>
              <button
                className="font-semibold text-purple-600 hover:text-pink-600 transition-colors">
                Sign in
              </button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
};
export default Register