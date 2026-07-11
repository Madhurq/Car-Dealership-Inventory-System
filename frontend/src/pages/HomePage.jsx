import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineShoppingCart, HiOutlineTag } from 'react-icons/hi';
import { RiCarLine, RiGasStationLine } from 'react-icons/ri';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const { user } = useAuth();

  const fetchVehicles = async () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchVehicles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timeout = setTimeout(fetchVehicles, 300);
    return () => clearTimeout(timeout);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePurchase = async (id) => {
    setPurchaseLoading(id);
    try {
      await api.post(`/vehicles/${id}/purchase`);
      toast.success('Vehicle purchased!');
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleClearFilters = () => {
    setFilters({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
        <p className="text-gray-500 mt-1">Browse and purchase available vehicles</p>
      </div>

      <SearchBar filters={filters} onFilterChange={setFilters} onClear={handleClearFilters} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div role="status" className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20">
          <RiCarLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No vehicles found</h2>
          <p className="text-gray-400 mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              purchaseLoading={purchaseLoading === vehicle.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VehicleCard({ vehicle, onPurchase, purchaseLoading }) {
  const outOfStock = vehicle.quantity <= 0;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${outOfStock ? 'border-red-200 opacity-75' : 'border-gray-100'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
            <RiGasStationLine />
            {vehicle.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${outOfStock ? 'bg-red-50 text-red-600' : vehicle.quantity <= 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {outOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
          </span>
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
    </div>
  );
}
