import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import VehicleForm from '../components/VehicleForm';
import { motion } from 'framer-motion';
import { HiOutlineTag, HiOutlineExclamationCircle, HiOutlineViewGrid } from 'react-icons/hi';
import { RiCarLine } from 'react-icons/ri';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const rowSlide = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const categories = new Set(vehicles.map((v) => v.category)).size;
    return { total, value, lowStock, categories };
  }, [vehicles]);

  const handleAdd = async (vehicle) => {
    setLoading(true);
    try {
      await api.post('/vehicles', vehicle);
      toast.success('Vehicle added');
      fetchVehicles();
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
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage your vehicle inventory</p>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard icon={RiCarLine} label="Total Vehicles" value={stats.total} color="blue" />
        <StatCard icon={HiOutlineTag} label="Inventory Value" value={stats.value} color="emerald" prefix="$" />
        <StatCard icon={HiOutlineExclamationCircle} label="Low Stock" value={stats.lowStock} color="amber" />
        <StatCard icon={HiOutlineViewGrid} label="Categories" value={stats.categories} color="purple" />
      </motion.div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editing ? 'Edit Vehicle' : 'New Vehicle'}
        </h2>
        <VehicleForm
          key={editing?.id || 'add'}
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={editing ? () => setEditing(null) : undefined}
          loading={loading}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicles</h2>
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <RiCarLine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No vehicles in inventory.</p>
            <p className="text-sm text-gray-400 mt-1">Add your first vehicle above.</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100"
          >
            {vehicles.map((v) => (
              <motion.div key={v.id} variants={rowSlide}>
                <VehicleRow
                  vehicle={v}
                  onEdit={() => setEditing(v)}
                  onDelete={() => handleDelete(v.id)}
                  onRestock={(qty) => handleRestock(v.id, qty)}
                />
              </motion.div>
            ))}
          </motion.div>
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
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <motion.div
      variants={cardUp}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-default"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={value} prefix={prefix} />
          </p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function VehicleRow({ vehicle, onEdit, onDelete, onRestock }) {
  const [restockQty, setRestockQty] = useState('');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{vehicle.make}</p>
        <p className="text-sm text-gray-500">{vehicle.model}</p>
        <p className="text-sm text-gray-500">
          {vehicle.category} &middot; ${vehicle.price.toLocaleString()} &middot; Qty: {vehicle.quantity}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
        >
          Delete
        </button>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="1"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            placeholder="Qty"
            className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={() => {
              if (restockQty) {
                onRestock(Number(restockQty));
                setRestockQty('');
              }
            }}
            disabled={!restockQty}
            className="px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
          >
            Restock
          </button>
        </div>
      </div>
    </div>
  );
}
