import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineTag, HiOutlinePlus, HiOutlinePencilAlt } from 'react-icons/hi';
import { RiCarLine, RiGasStationLine } from 'react-icons/ri';
import SearchBar from '../components/SearchBar';
import VehicleForm from '../components/VehicleForm';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const { user } = useAuth();

  // ponytail: fetch logic inlined — no stale closure, no eslint-disable
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const isInitial = vehicles.length === 0;
      if (isInitial) setLoading(true);
      try {
        const params = {};
        if (filters.make) params.make = filters.make;
        if (filters.model) params.model = filters.model;
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const hasFilters = Object.values(filters).some((v) => v !== '');
        const { data } = hasFilters
          ? await api.get('/vehicles/search', { params })
          : await api.get('/vehicles');
        setVehicles(data);
      } catch {
        toast.error('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePurchase = async (id) => {
    setPurchaseLoading(id);
    try {
      await api.post(`/vehicles/${id}/purchase`);
      toast.success('Vehicle purchased!');
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, quantity: v.quantity - 1 } : v))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleClearFilters = () => {
    setFilters({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, data);
        toast.success('Vehicle updated!');
      } else {
        await api.post('/vehicles', data);
        toast.success('Vehicle added!');
      }
      const { data: refreshed } = await api.get('/vehicles');
      setVehicles(refreshed);
      setShowForm(false);
      setEditingVehicle(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save vehicle');
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="text-gray-500 mt-1">Browse and purchase available vehicles</p>
        </div>
        {user && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Vehicle
          </button>
        )}
      </div>

      <SearchBar filters={filters} onFilterChange={setFilters} onClear={handleClearFilters} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div role="status" className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : vehicles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20"
        >
          <RiCarLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No vehicles found</h2>
          <p className="text-gray-400 mt-1">Try adjusting your search filters</p>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        >
          {vehicles.map((vehicle) => (
            <motion.div key={vehicle.id} variants={cardUp}>
              <VehicleCard
                vehicle={vehicle}
                onPurchase={handlePurchase}
                purchaseLoading={purchaseLoading === vehicle.id}
                onEdit={user ? () => openEdit(vehicle) : null}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add/Edit modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
              </h2>
              <VehicleForm
                initial={editingVehicle ? { make: editingVehicle.make, model: editingVehicle.model, category: editingVehicle.category, price: editingVehicle.price, quantity: editingVehicle.quantity } : null}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                loading={formLoading}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VehicleCard({ vehicle, onPurchase, purchaseLoading, onEdit }) {
  const outOfStock = vehicle.quantity <= 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      className={`bg-white rounded-2xl border ${outOfStock ? 'border-red-200 opacity-75' : 'border-gray-100'}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
            <RiGasStationLine />
            {vehicle.category}
          </span>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                title="Edit vehicle"
              >
                <HiOutlinePencilAlt className="w-4 h-4" />
              </button>
            )}
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${outOfStock ? 'bg-red-50 text-red-600' : vehicle.quantity <= 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {outOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900">{vehicle.make}</h3>
        <p className="text-gray-500 mt-0.5">{vehicle.model}</p>

        <div className="flex items-center gap-1.5 mt-4 text-gray-900 font-semibold">
          <HiOutlineTag className="w-4 h-4 text-gray-400" />
          ${vehicle.price.toLocaleString()}
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={outOfStock || purchaseLoading}
          className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 ${outOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50'}`}
        >
          <HiOutlineShoppingCart />
          {outOfStock ? 'Unavailable' : purchaseLoading ? 'Purchasing...' : 'Purchase'}
        </button>
      </div>
    </motion.div>
  );
}
