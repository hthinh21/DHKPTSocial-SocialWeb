import React, { useEffect, useState } from 'react'
import Spiner from '../components/Spiner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import LogoSvg from '../components/svgs/DHKPTSocial';
const Login = () => {
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
        navigate('/home'); 
      }
    })
    
    const handleLogin = () => {
        setLoading(true);
        axios
        .get(`http://localhost:1324/users/username/${username}`)
        .then((response) => {
            setUser(response.data);
            setLoading(false);
            if(password === ''){
              enqueueSnackbar('Chưa nhập đầy đủ thông tin', { variant: 'error' });
              setLoading(false);
            }
            else if(password !== response.data.password){
              enqueueSnackbar('Sai mật khẩu', { variant: 'error' });
              setLoading(false);
            }
            else if (response.data.status ==='Banned'){
              enqueueSnackbar('Tài khoản của bạn đã bị khóa', {variant: 'error'}) ;
            }
            else{
              enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
              Cookies.set('customerId', response.data._id, { expires: 1 });
              Cookies.set('customerName', response.data.name, { expires: 1 });
              setLoading(false);
              navigate('/home');
              // Lấy vị trí hiện tại của người dùng 
              // if (navigator.geolocation) {
              //   navigator.geolocation.getCurrentPosition(
              //     (position) => {
              //       setLocation({
              //         latitude: position.coords.latitude,
              //         longitude: position.coords.longitude,
              //       });
              //       console.log(position.coords.latitude +' / ' + position.coords.longitude);
              //     },
              //     (err) => {
              //       console.log(err);
              //     }
              //   );
              // } else {
              //   setError("Trình duyệt của bạn không hỗ trợ Geolocation.");
              // }
            }
        })
        .catch((error) => {
            enqueueSnackbar('Người dùng không tồn tại', { variant: 'error' });
            setLoading(false);
        });
    }
  return (
    // <div className='max-w-screen mx-auto flex h-screen '>
		// 	<div className='flex-1 hidden lg:flex items-center justify-center bg-gradient-to-r  from-violet-400 to-violet-600'>
		// 		<LogoSvg className='lg:w-2/3 fill-white' />
		// 	</div>
		// 	<div className='flex-1 flex flex-col justify-center items-center bg-gradient-to-l  from-violet-400 to-violet-600'>
		// 		<form className='flex gap-4 flex-col w-2/5'>
		// 			<h1 className='text-4xl font-extrabold text-white mb-4'>{"Let's"} go.</h1>
		// 			<label className='input input-bordered rounded flex items-center gap-2 bg-white p-2'>
		// 				<MdOutlineMail/>
		// 				<input
		// 					type='text'
		// 					className='grow hover:outline-none focus:outline-none'
		// 					placeholder='Username'
		// 					name='username'
    //           value={username}
    //           onChange={(e) => setUsername(e.target.value)}
		// 				/>
		// 			</label>

		// 			<label className='input input-bordered rounded flex items-center gap-2 bg-white p-2'>
		// 				<MdPassword />
		// 				<input
		// 					type='password'
		// 					className='grow hover:outline-none focus:outline-none'
		// 					placeholder='Password'
		// 					name='password'
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
		// 				/>
		// 			</label>
		// 			<button className='btn rounded-full text-white bg-black p-2' onClick={handleLogin}>Login</button>
		// 		</form>
		// 		<div className='flex flex-col gap-2 mt-4'>
		// 			<p className='text-white text-lg'>{"Don't"} have an account?</p>
		// 			<Link to='/register'>
		// 				<button className='btn rounded-full btn-primary text-white btn-outline w-full bg-black p-2'>Sign up</button>
		// 			</Link>
		// 		</div>
		// 	</div>
		// </div>

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
          Welcome Back
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

            {/* Register Link */}
            <div className="text-sm text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to='/register'>
                <button
                  className="font-semibold text-purple-600 hover:text-pink-600 transition-colors">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login