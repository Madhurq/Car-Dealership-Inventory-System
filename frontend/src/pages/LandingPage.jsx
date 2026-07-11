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
import { RiCarLine, RiGasStationLine, RiSpeedLine, RiVipCrownLine, RiTruckLine } from 'react-icons/ri';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 7) % 100),
  y: 30 + ((i * 19 + 11) % 70),
  size: 1.5 + (i % 4) * 0.5,
  delay: (i * 0.35) % 5,
  duration: 5 + (i % 7),
}));

const brands = ['Toyota', 'Honda', 'BMW', 'Ford', 'Tesla', 'Chevrolet', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Kia', 'Porsche', 'Lexus', 'Jeep', 'Subaru'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <RiCarLine className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AutoVault</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="#features"
              className="hidden sm:inline px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Features
            </a>
            <Link
              to="/vehicles"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Inventory
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-semibold text-slate-900 bg-white hover:bg-gray-100 rounded-full transition-all shadow-lg shadow-white/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-slate-950">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Animated gradient blobs — each in its own overflow-hidden */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-500/25 to-emerald-500/10 blur-[128px]"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.4, 0.25],
              x: [0, 40, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-[128px]"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.35, 0.2],
              x: [0, -30, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-teal-600/5 blur-[160px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
              animate={{
                y: [-10, -800],
                opacity: [0, 0.5, 0.5, 0],
                x: [0, (p.id % 2 === 0 ? 30 : -30)],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Tilted car card */}
        <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 hidden lg:block pointer-events-none">
          <motion.div
            initial={{ opacity: 0, rotate: 12, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 12, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-72 h-48 rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 shadow-2xl shadow-black/30"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5" />
            <RiCarLine className="relative w-16 h-16 text-teal-400/60 mb-4" />
            <div className="relative space-y-2">
              <div className="h-2 w-3/4 bg-white/10 rounded-full" />
              <div className="h-2 w-1/2 bg-white/10 rounded-full" />
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] text-emerald-400/80 font-medium tracking-wide uppercase">Live</span>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.92] tracking-tight">
              Smart Car Dealership
              <span className="block mt-2 bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Inventory Management
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Streamline your operations with real-time inventory tracking,
            smart search, and powerful analytics. Built for modern dealerships.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-12 flex flex-wrap justify-center gap-5"
          >
            <Link
              to="/register"
              className="group relative px-8 py-4 text-base font-semibold text-slate-900 bg-white rounded-2xl transition-all duration-300 shadow-2xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">Get Started Free</span>
              <span className="relative z-10 inline-flex h-5 w-5 items-center justify-center overflow-hidden">
                <span className="absolute transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">&rarr;</span>
                <span className="absolute transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">&nearr;</span>
              </span>
            </Link>
            <Link
              to="/vehicles"
              className="group relative px-8 py-4 text-base font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/5 rounded-2xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                View Inventory
                <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden">
                  <span className="absolute transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">&rarr;</span>
                  <span className="absolute transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">&nearr;</span>
                </span>
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Brand ticker */}
      <div className="relative overflow-hidden py-6 border-y border-gray-100 bg-gray-50/50">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="mx-8 text-lg font-semibold text-gray-300 select-none">{brand}</span>
          ))}
        </div>
      </div>

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

      {/* Showcase */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-teal-600 tracking-wide uppercase">Categories</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Featured Categories
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Browse our extensive collection across every category.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <ShowcaseCard
              icon={RiSpeedLine}
              title="Sports Cars"
              count="120+ Models"
              description="High-performance machines built for speed and precision."
              gradient="from-red-500 via-orange-500 to-amber-500"
              delay={0}
            />
            <ShowcaseCard
              icon={RiVipCrownLine}
              title="Luxury Sedans"
              count="85+ Models"
              description="Premium comfort meets cutting-edge technology."
              gradient="from-blue-600 via-indigo-600 to-purple-600"
              delay={0.1}
            />
            <ShowcaseCard
              icon={RiTruckLine}
              title="SUVs & Trucks"
              count="200+ Models"
              description="Power and versatility for every adventure."
              gradient="from-teal-500 via-emerald-500 to-green-500"
              delay={0.2}
            />
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
            className="relative bg-slate-950 rounded-[2rem] p-12 md:p-20 text-center overflow-hidden"
          >
            {/* CTA background effects */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
            </div>
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready to transform your
                <span className="block bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                  inventory?
                </span>
              </h2>
              <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                Join hundreds of dealerships using AutoVault to streamline their operations. Free to start, powerful to scale.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-5">
                <Link
                  to="/register"
                  className="group relative px-8 py-4 text-base font-semibold text-slate-900 bg-white rounded-2xl transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10">Start for Free</span>
                  <span className="relative z-10 inline-flex h-5 w-5 items-center justify-center overflow-hidden">
                    <span className="absolute transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">&rarr;</span>
                    <span className="absolute transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">&nearr;</span>
                  </span>
                </Link>
                <Link
                  to="/vehicles"
                  className="px-8 py-4 text-base font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/5 rounded-2xl transition-all duration-300"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <RiCarLine className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">AutoVault</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <Link to="/vehicles" className="hover:text-gray-900 transition-colors">Inventory</Link>
            <Link to="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-gray-900 transition-colors">Register</Link>
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
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ring-1 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{title}</h3>
      <p className="mt-2.5 text-gray-500 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

function ShowcaseCard({ icon: Icon, title, count, description, gradient, delay }) {
  return (
    <motion.div
      variants={cardUp}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      className={`group relative rounded-3xl p-8 md:p-10 text-white overflow-hidden cursor-pointer min-h-[280px] flex flex-col justify-end bg-gradient-to-br ${gradient} shadow-lg`}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
      {/* Icon */}
      <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-30 transition-opacity">
        <Icon className="w-24 h-24" />
      </div>
      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-white/70 mb-1">{count}</p>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-white/80 text-sm leading-relaxed">{description}</p>
        <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 group-hover:text-white group-hover:gap-3 transition-all">
          Browse <span>&rarr;</span>
        </div>
      </div>
    </motion.div>
  );
}
