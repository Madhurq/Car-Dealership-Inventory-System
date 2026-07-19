import { HiOutlineShoppingCart, HiOutlineTag } from 'react-icons/hi';
import { RiGasStationLine } from 'react-icons/ri';

export default function VehicleCard({ vehicle, onPurchase, purchaseLoading }) {
  const outOfStock = vehicle.quantity <= 0;

  return (
    <div className={`vehicle-card ${outOfStock ? 'vehicle-card--out' : ''}`} id={`vehicle-${vehicle.id}`}>
      <div className="vehicle-card-header">
        <span className="vehicle-category">
          <RiGasStationLine />
          {vehicle.category}
        </span>
        <span className={`vehicle-stock ${outOfStock ? 'stock-out' : vehicle.quantity <= 3 ? 'stock-low' : 'stock-ok'}`}>
          {outOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
        </span>
      </div>

      <div className="vehicle-card-body">
        <h3 className="vehicle-make">{vehicle.make}</h3>
        <p className="vehicle-model">{vehicle.model}</p>
      </div>

      <div className="vehicle-card-footer">
        <div className="vehicle-price">
          <HiOutlineTag className="price-icon" />
          <span>₹{vehicle.price.toLocaleString()}</span>
        </div>

        <button
          className="btn btn-purchase"
          onClick={() => onPurchase(vehicle.id)}
          disabled={outOfStock || purchaseLoading}
          id={`purchase-btn-${vehicle.id}`}
        >
          <HiOutlineShoppingCart />
          <span>{outOfStock ? 'Unavailable' : 'Purchase'}</span>
        </button>
      </div>
    </div>
  );
}
