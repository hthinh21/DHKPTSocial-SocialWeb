import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
const SettingPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const handleLogOut = () => {
    try{
      Cookies.remove('customerId');
      Cookies.remove('customerName');
      navigate('/login');
      enqueueSnackbar('Đăng xuất thành công', { variant: 'success' });
    }
    catch(error){
      enqueueSnackbar('Đăng xuất thất bại', { variant: 'success' });
      console.log(error);
    }
  }
  return (
    <>
    <div className='h-screen flex justify-center items-center text-lg font-bold'>
      <button onClick={handleLogOut} className='px-6 py-4 bg-black text-white hover:cursor-pointer hover:text-red-500 rounded-lg shadow-lg'>Đăng xuất</button>
    </div>
    </>
    
  )
}

export default SettingPage