import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

export default function SearchBar({ filters, onFilterChange, onClear }) {
  const handleChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      id="search-bar"
      className="bg-white rounded-xl border border-gray-200 p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineSearch className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">Search & Filter</span>
        <AnimatePresence>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              id="search-clear"
              onClick={onClear}
              className="ml-auto flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition"
            >
              <HiOutlineX className="w-3.5 h-3.5" />
              Clear
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          name="make"
          placeholder="Make (e.g. Toyota)"
          value={filters.make}
          onChange={handleChange}
          id="search-make"
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <input
          type="text"
          name="model"
          placeholder="Model (e.g. Camry)"
          value={filters.model}
          onChange={handleChange}
          id="search-model"
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. SUV)"
          value={filters.category}
          onChange={handleChange}
          id="search-category"
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          id="search-min-price"
          min="0"
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          id="search-max-price"
          min="0"
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
      </div>
    </motion.div>
  );
}
