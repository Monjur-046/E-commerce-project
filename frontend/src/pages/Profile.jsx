
import {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {formatPrice} from '../data/products';

function Profile() {
  const {user} = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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

    fetchOrders();
  }, []);

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
        <h2>My Orders</h2>
        <p>Your shopping history</p>

        {loading && <p>Loading your orders...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div>
            <p>You haven't placed any orders yet.</p>
            <Link to="/">Start Shopping</Link>
          </div>
        )}

        {!loading && !error && orders.map((order) => (
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
              {order.items.map((item) => (
                <div
                  key={item._id}
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
          </div>
        ))}
      </section>
    </main>
  );
}

export default Profile;
