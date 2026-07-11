import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import VehicleForm from '../components/VehicleForm';

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
      <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      <p className="text-gray-500 mt-1">Manage your vehicle inventory</p>

      <div className="mt-8">
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

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicles</h2>
        {vehicles.length === 0 ? (
          <p className="text-gray-400">No vehicles in inventory.</p>
        ) : (
          <div className="space-y-4">
            {vehicles.map((v) => (
              <VehicleRow
                key={v.id}
                vehicle={v}
                onEdit={() => setEditing(v)}
                onDelete={() => handleDelete(v.id)}
                onRestock={(qty) => handleRestock(v.id, qty)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleRow({ vehicle, onEdit, onDelete, onRestock }) {
  const [restockQty, setRestockQty] = useState('');

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{vehicle.make}</p>
        <p className="text-sm text-gray-500">{vehicle.model}</p>
        <p className="text-sm text-gray-500">{vehicle.category} · ${vehicle.price.toLocaleString()} · Qty: {vehicle.quantity}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={onEdit} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Edit</button>
        <button onClick={onDelete} className="px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min="1"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            placeholder="Qty"
            className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-lg"
          />
          <button
            onClick={() => { if (restockQty) { onRestock(Number(restockQty)); setRestockQty(''); } }}
            disabled={!restockQty}
            className="px-3 py-1.5 text-sm rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 disabled:opacity-50 transition"
          >
            Restock
          </button>
        </div>
      </div>
    </div>
  );
}
