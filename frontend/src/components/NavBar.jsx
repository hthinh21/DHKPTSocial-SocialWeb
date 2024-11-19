import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-2 md:flex md:justify-between md:items-center">
      {/* Logo */}
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Admin Dashboard
        </Link>
        <button
          className="md:hidden text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      </div>

      {/* Menu Items */}
      <ul
        className={`mt-2 md:flex md:items-center md:space-x-6 md:mt-0 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <li>
          <Link
            to="/admin"
            className="block py-2 px-4 hover:bg-blue-500 rounded-md md:hover:bg-transparent"
          >
            List Users
          </Link>
        </li>
        <li>
          <Link
            to="/admins"
            className="block py-2 px-4 hover:bg-blue-500 rounded-md md:hover:bg-transparent"
          >
            List Admins
          </Link>
        </li>
        <li>
          <Link
            to="/comments/reports"
            className="block py-2 px-4 hover:bg-blue-500 rounded-md md:hover:bg-transparent"
          >
            Comment Reports
          </Link>
        </li>
        <li>
          <Link
            to="/posts/reports"
            className="block py-2 px-4 hover:bg-blue-500 rounded-md md:hover:bg-transparent"
          >
            Post Reports
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
