
import {Link, useLocation, Navigate} from 'react-router-dom';
import {formatPrice} from '../data/products';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="confirmation-page">
      <header className="confirmation-header">
        <Link to="/" className="confirmation-brand">
          KICHU KINBEN
          <span>THOUGHTFULLY SELECTED</span>
        </Link>
      </header>

      <main className="confirmation-container">
        <div className="confirmation-success-icon">
          <span>✓</span>
        </div>

        <p className="confirmation-eyebrow">ORDER CONFIRMED</p>

        <h1>Thank you for your order<span>.</span></h1>

        <p className="confirmation-description">
          Your order has been successfully placed. We're getting everything ready for you.
        </p>

        <section className="confirmation-order-card">
          <div className="confirmation-order-heading">
            <div>
              <span>ORDER NUMBER</span>
              <h2>#{order._id}</h2>
            </div>

            <span className="confirmation-status">
              {order.orderStatus}
            </span>
          </div>

          <div className="confirmation-items">
            {order.items.map((item) => (
              <div className="confirmation-item" key={item._id}>
                <div className="confirmation-item-image">
                  <img src={item.image} alt={item.name} />
                  <span>{item.quantity}</span>
                </div>

                <div className="confirmation-item-info">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <strong>
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>

          <div className="confirmation-total-details">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(order.subtotal)}</strong>
            </div>

            <div>
              <span>Delivery charge</span>
              <strong>{formatPrice(order.deliveryCharge)}</strong>
            </div>

            <div className="confirmation-grand-total">
              <span>Total paid / payable</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>

          <div className="confirmation-payment">
            <div>
              <span>Payment method</span>
              <strong>
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </strong>
            </div>

            <div>
              <span>Payment status</span>
              <strong>{order.paymentStatus}</strong>
            </div>
          </div>

          <div className="confirmation-address">
            <h3>Delivery Address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </section>

        <div className="confirmation-actions">
          <Link to="/" className="confirmation-shop-button">
            Continue Shopping ↗
          </Link>
        </div>

        <p className="confirmation-note">
          Thank you for choosing KICHU KINBEN.
        </p>
      </main>

      <footer className="confirmation-footer">
        <Link to="/">KICHU KINBEN</Link>
        <span>© 2026 All rights reserved.</span>
      </footer>
    </div>
  );
}

export default OrderConfirmation;
