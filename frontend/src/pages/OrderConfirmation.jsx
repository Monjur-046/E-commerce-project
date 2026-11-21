
import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {formatPrice} from '../data/products';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  const orderId = location.state?.order?._id ||
    new URLSearchParams(location.search).get('orderId');

  const paymentStatus = order?.paymentStatus || 'pending';
  const paymentType = new URLSearchParams(location.search).get('payment');

  const isLateSuccess = paymentType === 'late-success';
  const isPaid = paymentStatus === 'paid';
  const isFailed = paymentStatus === 'failed';
  const isCancelled = paymentStatus === 'cancelled';
  const isPending = paymentStatus === 'pending';

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order information not found.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login', {replace: true});
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load order');
        }

        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="confirmation-page">
        <main className="confirmation-container">
          <p>Loading your order details...</p>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="confirmation-page">
        <main className="confirmation-container">
          <h2>Unable to load order</h2>
          <p>{error || 'Order not found.'}</p>
          <Link to="/">Back to shopping</Link>
        </main>
      </div>
    );
  }

  const heading = isLateSuccess
    ? 'Payment received after cancellation'
    : isPaid || order.paymentMethod === 'cod'
      ? 'Thank you for your order'
      : isFailed
        ? 'Payment failed'
        : isCancelled
          ? 'Payment cancelled'
          : 'Payment is processing';

  const description = isLateSuccess
    ? 'Your payment was received after this order was cancelled. Please contact support to arrange a refund.'
    : isPaid
      ? 'Your payment has been verified successfully. We are getting everything ready for you.'
      : order.paymentMethod === 'cod'
        ? 'Your order has been successfully placed. You can pay when your order arrives.'
        : isFailed
          ? 'Your payment could not be completed. Please contact support if money was deducted.'
          : isCancelled
            ? 'Your payment was cancelled. You can return to shopping and try again.'
            : 'Your payment status is not confirmed yet. Please wait while we verify your transaction.';

  const showSuccessIcon =
    !isLateSuccess && (isPaid || order.paymentMethod === 'cod');

  const eyebrow = isLateSuccess
    ? 'LATE PAYMENT RECEIVED'
    : showSuccessIcon
      ? 'ORDER CONFIRMED'
      : isFailed
        ? 'PAYMENT FAILED'
        : isCancelled
          ? 'PAYMENT CANCELLED'
          : 'PAYMENT PENDING';

  const statusLabel = isLateSuccess
    ? 'Cancelled - Refund Required'
    : order.orderStatus;

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
          <span>
            {isLateSuccess
              ? '!'
              : showSuccessIcon
                ? '✓'
                : isFailed
                  ? '!'
                  : isCancelled
                    ? '×'
                    : '…'}
          </span>
        </div>

        <p className="confirmation-eyebrow">
          {eyebrow}
        </p>

        <h1>{heading}<span>.</span></h1>

        <p className="confirmation-description">
          {description}
        </p>

        <section className="confirmation-order-card">
          <div className="confirmation-order-heading">
            <div>
              <span>ORDER NUMBER</span>
              <h2>#{order._id}</h2>
            </div>

            <span className="confirmation-status">
              {statusLabel}
            </span>
          </div>

          <div className="confirmation-items">
            {order.items.map((item, index) => (
              <div className="confirmation-item" key={item._id || index}>
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
              <span>Total payable</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>

          <div className="confirmation-payment">
            <div>
              <span>Payment method</span>
              <strong>
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : 'Online Payment'}
              </strong>
            </div>

            <div>
              <span>Payment status</span>
              <strong>{order.paymentStatus}</strong>
            </div>
          </div>

          {isLateSuccess && (
            <div className="confirmation-address">
              <h3>Refund Information</h3>
              <p>Your order remains cancelled.</p>
              <p>Please contact the store support team with your order number to arrange a refund.</p>
            </div>
          )}

          <div className="confirmation-address">
            <h3>Delivery Address</h3>
            <p>{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
            </p>
            <p>{order.shippingAddress?.phone}</p>
          </div>
        </section>

        <div className="confirmation-actions">
          <Link to="/profile" className="confirmation-shop-button">
            View My Orders ↗
          </Link>

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
