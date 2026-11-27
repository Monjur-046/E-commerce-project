
import {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {formatPrice} from '../data/products';
import {API_BASE_URL} from '../config/api';

function Profile() {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load orders');
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError('');
    setPasswordMessage('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/api/auth/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to change password');
      }

      setPasswordMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login', {replace: true});
        window.location.reload();
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || 'Unable to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) return;

    setCancellingId(orderId);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/cancel`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to cancel order');
      }

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      setMessage(data.message);
    } catch (err) {
      setError(err.message || 'Unable to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main
      className="auth-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}
    >
      <section
        className="auth-card"
        style={{width: '100%', maxWidth: '600px'}}
      >
        <h1>My Profile</h1>
        <p>Welcome, {user.name}!</p>

        <div className="form-group">
          <label>Full Name</label>
          <p>{user.name}</p>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <p>{user.email}</p>
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <p>{user.role}</p>
        </div>
      </section>

      <section
        className="auth-card"
        style={{width: '100%', maxWidth: '600px'}}
      >
        <h2>Change Password</h2>
        <p>Update your account password securely.</p>

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={6}
              required
            />
          </div>

          {passwordError && (
            <p role="alert" style={{color: '#b42318'}}>
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p role="status" style={{color: '#16803c'}}>
              {passwordMessage}
              <br />
              Redirecting to login...
            </p>
          )}

          <button type="submit" disabled={passwordLoading}>
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      <section
        className="auth-card"
        style={{width: '100%', maxWidth: '600px'}}
      >
        <h2>My Orders</h2>
        <p>Your shopping history</p>

        {loading && <p>Loading your orders...</p>}

        {error && <p role="alert">{error}</p>}

        {message && <p role="status">{message}</p>}

        {!loading && !error && orders.length === 0 && (
          <div>
            <p>You haven't placed any orders yet.</p>
            <Link to="/">Start Shopping</Link>
          </div>
        )}

        {!loading && orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '16px'
            }}
          >
            <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>

            <p>
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p>
              Order Status: <strong>{order.orderStatus}</strong>
            </p>

            <p>
              Payment: <strong>{order.paymentMethod.toUpperCase()}</strong>
            </p>

            <p>
              Payment Status: <strong>{order.paymentStatus}</strong>
            </p>

            <div>
              {order.items.map((item, index) => (
                <div
                  key={item._id || `${order._id}-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '12px'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '55px',
                      height: '55px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />

                  <div>
                    <p>{item.name}</p>
                    <p>{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop: '16px'}}>
              <p>Subtotal: {formatPrice(order.subtotal)}</p>
              <p>Delivery: {formatPrice(order.deliveryCharge)}</p>
              <h3>Total: {formatPrice(order.total)}</h3>
            </div>

            {['pending', 'processing'].includes(order.orderStatus) && (
              <button
                type="button"
                onClick={() => handleCancelOrder(order._id)}
                disabled={cancellingId === order._id}
                style={{
                  marginTop: '12px',
                  padding: '10px 18px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#b42318',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}

export default Profile;
