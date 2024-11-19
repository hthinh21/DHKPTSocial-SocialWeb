import React, { useEffect, useState } from 'react'
import CardPost from '../../components/CardPost.jsx'
import Cookies from 'js-cookie';
import axios from 'axios';

const HomePage = () => {
  const[defaultPost, setDefaultPost] = useState([]);
  const[postIDs, setPostID] = useState([]);
  const[reload, setReload] = useState('');
  const[loadNewest, setLoadNewest] = useState(false);
  const[loadOldest, setLoadOldest] = useState(false);
  const fetchFollow = async (userID) => {
    try{
      const responseFollow = await axios.get(`http://localhost:1324/users/${userID}`);
      console.log(responseFollow.data.followings);
      const followers = responseFollow.data.followings;
      let postList = [];
      for(let i = 0; i < followers.length; i++){
        const responseArticle = await axios.get(`http://localhost:1324/articles/${followers[i]._id}`);
        for(let i = 0; i < responseArticle.data.count; i++)
        {
          postList.push(responseArticle.data.data[i]);
        }
      }
      setDefaultPost(postList);
      setPostID(shuffleArray(postList));
    }
    catch(error){
      console.log(error);
    }
  }
  
  useEffect(() => {
    const id = Cookies.get('customerId');
    fetchFollow(id);
  }, [])
  //Trộn bài đăng
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Tạo số ngẫu nhiên từ 0 đến i
      const j = Math.floor(Math.random() * (i + 1));
      // Hoán đổi phần tử thứ i và j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  //Sắp xếp theo ngày đăng gần nhất
  function sortPostsByDate(posts) {
    return posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }
  return (
    <>  
      <div className='w-full flex justify-center pt-2'>
        <div className='w-2/3 flex justify-center gap-2'>
          <button className={`px-4 py-2 rounded-md ${loadNewest ? ('bg-black text-white'): ('bg-white text black')}`} onClick={() => {setLoadNewest(true); setLoadOldest(false)}}>Đăng gần đây</button>
          <button className={`px-4 py-2 rounded-md ${loadOldest ? ('bg-black text-white'): ('bg-white text black')}`} onClick={() => {setLoadNewest(false); setLoadOldest(true)}}>Đăng đã lâu</button>
          <button className='px-4 py-2 bg-white rounded-md' onClick={() => {setLoadNewest(false); setLoadOldest(false)}}>Tải lại</button>
        </div>
      </div>
      <div className='flex w-full'>
        <div className='flex-[4_4_0] mr-auto min-h-screen w-full'>
          {loadNewest ? (
            (sortPostsByDate(defaultPost)).map((post, index) => (
              <div key={index} className='mt-2'>
                <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
              </div>
            ))
          ):(
            <div className='hidden'></div>
          )}
          {loadOldest ? (
            sortPostsByDate(defaultPost).reverse().map((post, index) => (
              <div key={index} className='mt-2'>
                <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
              </div>
            ))
          ):(
            <div className='hidden'></div>
          )}
          {!loadOldest && !loadNewest ? (
            postIDs.map((post, index) => (
              <div key={index} className='mt-2'>
                <CardPost postID={post._id} author={post.userID} description={post.description} post={post}/>
              </div>
            ))
          ): (
            <div className='hidden'></div>
          )}
        </div>
      </div>
    </>
    
  )
}

export default HomePage