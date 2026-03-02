import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  return (
    <nav className="fixed w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg top-0 left-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            StudyRox
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-slate-800 font-medium tracking-wide">
          {user && (
          <Link to ="/" className="hover:text-indigo-500 transition"> 
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition shadow-md"
            >
              Logout
            </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button - Only show if logged in */}
        {user && (
          <div className="md:hidden text-slate-800">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isOpen && user && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-4 text-slate-800 shadow-xl absolute w-full left-0 top-full">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;