import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLogout, HiOutlineShieldCheck, HiOutlineLogin, HiOutlineUserAdd } from 'react-icons/hi';
import { RiCarLine } from 'react-icons/ri';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-16 bg-white border-b border-gray-200 z-50" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <RiCarLine className="w-8 h-8 text-teal-600" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">AutoVault</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:flex items-center gap-1.5 mr-2">
                {isAdmin && <HiOutlineShieldCheck className="w-4 h-4 text-teal-600" />}
                {user.email}
              </span>
              {isAdmin && (
                <Link
                  to="/admin"
                  id="admin-link"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                id="logout-btn"
                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1.5"
              >
                <HiOutlineLogout className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                id="login-link"
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition flex items-center gap-1.5"
              >
                <HiOutlineLogin className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                id="register-link"
                className="px-4 py-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition flex items-center gap-1.5"
              >
                <HiOutlineUserAdd className="w-4 h-4" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
