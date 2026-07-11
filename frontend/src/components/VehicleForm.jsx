import { useState } from 'react';

export default function VehicleForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(
    initial || { make: '', model: '', category: '', price: '', quantity: '' }
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.make.trim()) errs.make = 'Make is required';
    if (!form.model.trim()) errs.model = 'Model is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.price || Number(form.price) < 0) errs.price = 'Valid price is required';
    if (form.quantity === '' || Number(form.quantity) < 0) errs.quantity = 'Valid quantity is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      make: form.make.trim(),
      model: form.model.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <input id="form-make" name="make" value={form.make} onChange={handleChange} placeholder="e.g. Toyota" className={inputClass('make')} />
          {errors.make && <p className="text-xs text-red-500 mt-1">{errors.make}</p>}
        </div>
        <div>
          <label htmlFor="form-model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input id="form-model" name="model" value={form.model} onChange={handleChange} placeholder="e.g. Camry" className={inputClass('model')} />
          {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="form-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input id="form-category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Sedan, SUV, Truck" className={inputClass('category')} />
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input id="form-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="25000" className={inputClass('price')} />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="form-quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input id="form-quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="10" className={inputClass('quantity')} />
          {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          id="form-submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Saving...' : initial ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        {onCancel && (
          <button
            type="button"
            id="form-cancel"
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
