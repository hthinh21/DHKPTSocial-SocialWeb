import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spiner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Cookies from 'js-cookie';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:1324/users')
      .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return (
    <>
    <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>User List</h1>
        <Link to='/register'>
          <MdOutlineAddBox className='text-sky-800 text-4xl' />
        </Link>
      </div>
      {loading ? (
        <div style={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
          <Spinner />
        </div>
      ) : (
        <table className='w-full border-separate border-spacing-2'>
          <thead>
            <tr>
              <th className="border border-slate-600 rounded-md">No</th>
              <th className="border border-slate-600 rounded-md">
                Username
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Password
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Name
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Date Of Birth
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className='h-8'>
                <td className='border border-slate-700 rounded-md text-center'>
                  {index + 1}
                </td>
                <td className='border border-slate-700 rounded-md text-center'>
                  {user.username}
                </td>
                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                  {user.password}
                </td>
                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                  {user.name}
                </td>
                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                  {user.dob}
                </td>
                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                  {user.email}
                </td>
                <td className='border border-slate-700 rounded-md text-center'>
                  <div className='flex justify-center gap-x-4'>
                    <Link to={`/users/details/${user._id}`}>
                      <BsInfoCircle className='text-2xl text-green-800'/>
                    </Link>
                    <Link to={`/users/edit/${user._id}`}>
                      <AiOutlineEdit className='text-2xl text-yellow-600'/>
                    </Link>
                    <Link to={`/users/delete/${user._id}`}>
                      <MdOutlineDelete className='text-2xl text-red-600'/>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
      }
    </>
  )
}

export default ListUser
