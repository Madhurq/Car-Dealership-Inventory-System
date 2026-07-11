import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiOutlineStar,
} from 'react-icons/hi';
import { RiCarLine } from 'react-icons/ri';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <RiCarLine className="w-8 h-8 text-teal-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">AutoVault</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="#features"
              className="hidden sm:inline px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Features
            </a>
            <Link
              to="/vehicles"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Inventory
            </Link>
            <Link
              to="/login"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-teal-100 mb-6 border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Trusted by 500+ dealerships
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Smart Car Dealership
              <span className="block mt-1 bg-gradient-to-r from-teal-200 to-blue-200 bg-clip-text text-transparent">
                Inventory Management
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-teal-100/90 max-w-2xl leading-relaxed">
              Streamline your operations with real-time inventory tracking,
              smart search, and powerful analytics. Built for modern dealerships.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group px-8 py-4 text-base font-semibold text-teal-700 bg-white hover:bg-gray-50 rounded-xl transition-all shadow-xl shadow-black/10 flex items-center gap-2"
              >
                Get Started Free
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/vehicles"
                className="px-8 py-4 text-base font-semibold text-white border-2 border-white/25 hover:border-white/50 hover:bg-white/10 rounded-xl transition-all"
              >
                View Inventory
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="h-20 bg-white relative">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Features</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need to manage inventory
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Powerful tools designed to help you track, manage, and grow your dealership inventory.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon={HiOutlineClock}
              title="Real-time Tracking"
              description="Track vehicle inventory with instant updates. Every sale, restock, and edit reflected across your team immediately."
              color="teal"
            />
            <FeatureCard
              icon={HiOutlineChartBar}
              title="Smart Analytics"
              description="Visual dashboards with inventory value, stock levels, category breakdowns, and low-stock alerts at a glance."
              color="blue"
            />
            <FeatureCard
              icon={HiOutlineSearch}
              title="Powerful Search"
              description="Find any vehicle instantly with filters by make, model, category, and price range. Never waste time scrolling."
              color="purple"
            />
            <FeatureCard
              icon={HiOutlineShieldCheck}
              title="Role-based Access"
              description="Admins get full control. Staff can browse and purchase. Secure JWT authentication keeps your data safe."
              color="emerald"
            />
            <FeatureCard
              icon={HiOutlineCog}
              title="Easy Management"
              description="Add, edit, restock, and remove vehicles with a clean admin interface. Bulk operations save you hours."
              color="amber"
            />
            <FeatureCard
              icon={HiOutlineStar}
              title="Built to Scale"
              description="Whether you track 10 vehicles or 10,000, AutoVault handles it. Clean API, fast queries, zero lag."
              color="rose"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            <motion.div variants={cardUp} className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-teal-600 to-teal-700 bg-clip-text text-transparent">500+</p>
              <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Dealerships</p>
            </motion.div>
            <motion.div variants={cardUp} className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">10K+</p>
              <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Vehicles Tracked</p>
            </motion.div>
            <motion.div variants={cardUp} className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-700 bg-clip-text text-transparent">99.9%</p>
              <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Uptime</p>
            </motion.div>
            <motion.div variants={cardUp} className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">24/7</p>
              <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Support</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-300 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Ready to transform your inventory?
              </h2>
              <p className="mt-4 text-lg text-teal-100/80 max-w-xl mx-auto">
                Join hundreds of dealerships using AutoVault to streamline their operations. Free to start.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 text-base font-semibold text-teal-700 bg-white hover:bg-gray-50 rounded-xl transition-all shadow-xl flex items-center gap-2"
                >
                  Start for Free
                  <span>&rarr;</span>
                </Link>
                <Link
                  to="/vehicles"
                  className="px-8 py-4 text-base font-semibold text-white border-2 border-white/25 hover:border-white/50 hover:bg-white/10 rounded-xl transition-all"
                >
                  Browse Inventory
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <RiCarLine className="w-6 h-6 text-teal-600" />
            <span className="font-semibold text-gray-900">AutoVault</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/vehicles" className="hover:text-gray-900 transition">Inventory</Link>
            <Link to="/login" className="hover:text-gray-900 transition">Sign In</Link>
            <Link to="/register" className="hover:text-gray-900 transition">Register</Link>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} AutoVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  const colors = {
    teal: 'bg-teal-50 text-teal-600 ring-teal-100',
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    rose: 'bg-rose-50 text-rose-600 ring-rose-100',
  };
  return (
    <motion.div
      variants={cardUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ring-1 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{title}</h3>
      <p className="mt-2.5 text-gray-500 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
