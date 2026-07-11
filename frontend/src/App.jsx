import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/AdminRoute';

function PageWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<PageWrap><HomePage /></PageWrap>} />
          <Route path="/login" element={<PageWrap><LoginPage /></PageWrap>} />
          <Route path="/register" element={<PageWrap><RegisterPage /></PageWrap>} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageWrap><AdminPage /></PageWrap>
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
