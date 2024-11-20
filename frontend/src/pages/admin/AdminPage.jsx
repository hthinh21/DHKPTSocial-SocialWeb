import { useEffect, useState } from "react";
import axios from "axios";
import Spiner from "../../components/Spiner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox } from "react-icons/md";
import Navbar from "../../components/NavBar";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState(null); // State để theo dõi việc hiển thị dropdown

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:1324/users")
      .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const toggleDropdown = (userId) => {
    setDropdown(dropdown === userId ? null : userId);
  };

  const handleStatusChange = (userId, status) => {
   
    axios
      .put(`http://localhost:1324/admin/status/${userId}`, { status })
      .then((response) => {
        
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, status } : user
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
    <Navbar />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8 text-center w-full" >Quản lý người dùng</h1>
        <Link to="/register">
          <MdOutlineAddBox className="text-sky-800 text-4xl" />
        </Link>
      </div>
      {loading ? (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Spiner />
        </div>
      ) : (
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="border border-slate-600 rounded-md">STT</th>
              <th className="border border-slate-600 rounded-md">ID</th>
              <th className="border border-slate-600 rounded-md">
                Tên Người Dùng
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Mật Khẩu
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Tên
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Ngày Sinh
              </th>
              <th className="border border-slate-600 rounded-md max-md:hidden">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="h-8">
                <td className="border border-slate-700 rounded-md text-center">
                  {index + 1}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {user._id}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {user.username}
                </td>
                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                  {user.password}
                </td>
                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                  {user.name}
                </td>
                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                  {user.dob}
                </td>
                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                  {user.email}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                                      
                    <div className="relative">
                      <span
                        className={`text-2xl ${
                          user.status === "Banned"
                            ? "text-red-600"
                            : "text-green-600"
                        } cursor-pointer`}
                        onClick={() => toggleDropdown(user._id)}
                      >
                        {user.status} 
                      </span>
                      {dropdown === user._id && (
                        <div
                          className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md"
                          style={{ top: "100%", left: "0" }} 
                        >
                          <button
                            onClick={() =>
                              handleStatusChange(user._id, "Banned")
                            }
                            className="px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                          >
                            Banned
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(user._id, "Active")
                            }
                            className="px-4 py-2 text-green-600 hover:bg-gray-100 w-full text-left"
                          >
                            Active
                          </button>
                        </div>
                      )}
                    </div>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AdminPage;
