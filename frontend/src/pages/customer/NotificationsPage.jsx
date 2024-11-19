import { Avatar } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
const NotificationsPage = () => {
  const [notifyList, setNotifyList] = useState([]);
  const fetchNotify = async (userID) => {
    const response = await axios.get(`http://localhost:1324/notifications/${userID}`)
    if(response)
    { 
      // console.log(response.data);
      setNotifyList(response.data.reverse());
    }
    else{
      console.log('Không có bình luận nào cả')
    }
  }
  fetchNotify(Cookies.get('customerId'));
  useEffect(() => {
    
  }, [])
  return (
    <div className='w-full flex justify-center'>
      <div className='w-3/6'>
        <div className='w-full flex jusfify-center items-center py-6 bg-black text-white font-bold rounded-b-lg shadow-lg'>
          <p className='text-center w-full text-xl'>Notifications</p>
        </div>
        {notifyList.length != null ? (
          notifyList.map((notification, index) => (
            <div key={index} className='w-full rounded-lg bg-black text-white py-4 flex px-4 mt-4'>
              <Avatar size='md' src={`data:image/png;base64,${notification.actor?.avatar}`}/>
              <div className='w-full flex items-center ml-4'>
                <p><b>{notification.actor?.name}</b> {notification.actionDetail}</p>
              </div>
            </div>
          ))
        ):(
          <div className='w-full mt-4 flex jusfify-center items-center py-6 bg-black text-white font-bold rounded-lg shadow-lg'>
          <p className='text-center w-full text-xl'>Không có thông báo nào</p>
        </div>
        )}
        
      </div>
    </div>
  )
}

export default NotificationsPage