import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import VehicleForm from '../components/VehicleForm';
import { motion } from 'framer-motion';
import {
  HiOutlineTag,
  HiOutlineExclamationCircle,
  HiOutlineViewGrid,
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineSearch,
} from 'react-icons/hi';
import { RiCarLine } from 'react-icons/ri';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const STAT_COLORS = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-l-blue-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-l-emerald-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-l-amber-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-l-purple-500' },
};

export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
    } catch {
      toast.error('Failed to load vehicles');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const value = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
    const lowStock = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length;
    const outOfStock = vehicles.filter((v) => v.quantity <= 0).length;
    return { total, value, lowStock, outOfStock };
  }, [vehicles]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    vehicles.forEach((v) => {
      map[v.category] = (map[v.category] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: vehicles.length ? Math.round((count / vehicles.length) * 100) : 0 }));
  }, [vehicles]);

  const lowStockVehicles = useMemo(
    () => vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).slice(0, 5),
    [vehicles]
  );

  const recentVehicles = useMemo(() => vehicles.slice(-5).reverse(), [vehicles]);

  const handleAdd = async (vehicle) => {
    setLoading(true);
    try {
      await api.post('/vehicles', vehicle);
      toast.success('Vehicle added');
      fetchVehicles();
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (vehicle) => {
    setLoading(true);
    try {
      await api.put(`/vehicles/${editing.id}`, vehicle);
      toast.success('Vehicle updated');
      setEditing(null);
      setShowForm(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete vehicle');
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      await api.post(`/vehicles/${id}/restock?quantity=${quantity}`);
      toast.success('Vehicle restocked');
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to restock');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your inventory overview.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-sm"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        <StatCard icon={RiCarLine} label="Total Vehicles" value={stats.total} color="blue" />
        <StatCard icon={HiOutlineTag} label="Inventory Value" value={stats.value} color="emerald" prefix="₹" />
        <StatCard icon={HiOutlineExclamationCircle} label="Low Stock" value={stats.lowStock} color="amber" />
        <StatCard icon={HiOutlineViewGrid} label="Out of Stock" value={stats.outOfStock} color="purple" />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-5">Inventory by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No data yet</p>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className="text-sm text-gray-500">{cat.count} vehicles &middot; {cat.pct}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-5">Low Stock Alerts</h2>
          {lowStockVehicles.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiOutlineExclamationCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500">All stock levels healthy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockVehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{v.make} {v.model}</p>
                    <p className="text-xs text-gray-500">{v.category}</p>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{v.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Vehicles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-200 mb-8"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recent Vehicles</h2>
          <Link to="/vehicles" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition">
            View all <HiOutlineChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recentVehicles.length === 0 ? (
          <div className="p-12 text-center">
            <RiCarLine className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No vehicles yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentVehicles.map((v) => (
              <div key={v.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${v.quantity <= 0 ? 'bg-red-50 text-red-500' : v.quantity <= 3 ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'}`}>
                    {v.make[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{v.make} {v.model}</p>
                    <p className="text-xs text-gray-500">{v.category} &middot; ₹{v.price.toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v.quantity <= 0 ? 'bg-red-50 text-red-600' : v.quantity <= 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {v.quantity <= 0 ? 'Out of stock' : `${v.quantity} in stock`}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Vehicle Management */}
      {(showForm || editing) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {editing ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <VehicleForm
            key={editing?.id || 'add'}
            initial={editing}
            onSubmit={editing ? handleUpdate : handleAdd}
            onCancel={() => { setEditing(null); setShowForm(false); }}
            loading={loading}
          />
        </motion.div>
      )}

      {/* Vehicle Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">All Vehicles ({vehicles.length})</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HiOutlineSearch className="w-4 h-4" />
            Manage inventory
          </div>
        </div>
        {vehicles.length === 0 ? (
          <div className="p-12 text-center">
            <RiCarLine className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No vehicles in inventory</p>
            <p className="text-sm text-gray-400 mt-1">Click &quot;Add Vehicle&quot; to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Price</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map((v) => (
                  <VehicleRow
                    key={v.id}
                    vehicle={v}
                    onEdit={() => { setEditing(v); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    onDelete={() => handleDelete(v.id)}
                    onRestock={(qty) => handleRestock(v.id, qty)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AnimatedNumber({ value, prefix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const num = typeof value === 'number' ? value : 0;
    if (num === 0) { setDisplay(0); return; }

    const duration = 800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);

  return <>{prefix}{display.toLocaleString()}</>;
}

function StatCard({ icon: Icon, label, value, color, prefix = '' }) {
  const c = STAT_COLORS[color];
  return (
    <motion.div
      variants={cardUp}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
      className={`bg-white rounded-2xl border border-gray-200 border-l-4 ${c.border} p-5 cursor-default`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={value} prefix={prefix} />
          </p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function VehicleRow({ vehicle, onEdit, onDelete, onRestock }) {
  const [restockQty, setRestockQty] = useState('');
  const v = vehicle;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${v.quantity <= 0 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
            {v.make[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{v.make} {v.model}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-3.5">
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{v.category}</span>
      </td>
      <td className="px-6 py-3.5 text-right font-medium text-gray-900">₹{v.price.toLocaleString()}</td>
      <td className="px-6 py-3.5 text-right">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v.quantity <= 0 ? 'bg-red-50 text-red-600' : v.quantity <= 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {v.quantity}
        </span>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={onEdit}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
          >
            Delete
          </button>
          <div className="flex items-center gap-1 ml-1">
            <input
              type="number"
              min="1"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              placeholder="Qty"
              className="w-14 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
            />
            <button
              onClick={() => {
                if (restockQty) {
                  onRestock(Number(restockQty));
                  setRestockQty('');
                }
              }}
              disabled={!restockQty}
              className="px-2.5 py-1.5 text-xs font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition"
            >
              Restock
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
