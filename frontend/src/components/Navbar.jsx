import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLogout, HiOutlineShieldCheck, HiOutlineLogin, HiOutlineUserAdd } from 'react-icons/hi';
import { RiCarLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const admin = pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 h-16 backdrop-blur-md border-b z-50 transition-colors ${admin ? 'bg-amber-50/90 border-amber-200/60' : 'bg-white/80 border-gray-100'}`}
      id="main-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <RiCarLine className={`w-7 h-7 ${admin ? 'text-amber-600' : 'text-teal-600'}`} />
          <span className="text-lg font-bold text-gray-900 tracking-tight">AutoVault</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            to="/vehicles"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition ${admin ? 'text-amber-700 hover:text-amber-900 hover:bg-amber-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Inventory
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  id="admin-link"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition ${admin ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Dashboard
                </Link>
              )}
              <span className="text-sm text-gray-400 hidden sm:flex items-center gap-1.5 mx-1">
                {isAdmin && <HiOutlineShieldCheck className={`w-4 h-4 ${admin ? 'text-amber-600' : 'text-teal-600'}`} />}
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                id="logout-btn"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1.5"
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
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition flex items-center gap-1.5"
              >
                <HiOutlineLogin className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                id="register-link"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition flex items-center gap-1.5"
              >
                <HiOutlineUserAdd className="w-4 h-4" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
