
import {useEffect, useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {formatPrice} from '../data/products';
import './Checkout.css';

function Checkout() {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const deliveryCharge = deliveryMethod === 'express' ? 150 : 120;

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal + deliveryCharge;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load cart');
        }

        const items = data.cart.items.map((item) => ({
          ...item.product,
          id: item.product._id,
          quantity: item.quantity
        }));

        setCart(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCart();
    } else {
      setLoading(false);
      setError('Please sign in to continue checkout.');
    }
  }, [token]);

  const handleShippingChange = (event) => {
    setShipping({
      ...shipping,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (paymentMethod === 'online') {
      setMessage('Online payment is not available yet. Please choose Cash on Delivery.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...shipping,
          deliveryMethod,
          paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to place order');
      }

      navigate('/order-confirmation', {
        replace: true,
        state: {
          order: data.order
        }
      });
    } catch (err) {
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="checkout-spinner"></div>
        <p>Preparing your checkout...</p>
      </div>
    );
  }

  if (error || cart.length === 0) {
    return (
      <div className="checkout-empty">
        <span>◇</span>
        <h2>{error ? 'Unable to load checkout' : 'Your cart is empty'}</h2>
        <p>{error || 'Add some products before proceeding to checkout.'}</p>
        <Link to="/" className="checkout-dark-button">
          Back to shopping ↗
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <Link to="/" className="checkout-brand">
          KICHU KINBEN
          <span>THOUGHTFULLY SELECTED</span>
        </Link>

        <div className="checkout-secure">
          <span>♧</span>
          Secure Checkout
        </div>
      </header>

      <main className="checkout-container">
        <div className="checkout-top">
          <div>
            <p className="checkout-eyebrow">ALMOST YOURS</p>
            <h1>Checkout<span>.</span></h1>
            <p>Complete your details and prepare for something special.</p>
          </div>

          <button
            type="button"
            className="checkout-back"
            onClick={() => navigate('/')}
          >
            ← Continue shopping
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="checkout-main">
            <section className="checkout-card">
              <div className="checkout-section-heading">
                <span className="checkout-step">01</span>
                <div>
                  <h2>Contact information</h2>
                  <p>Where can we reach you?</p>
                </div>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-field">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleShippingChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={shipping.email}
                    onChange={handleShippingChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="checkout-field full-width">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shipping.phone}
                    onChange={handleShippingChange}
                    placeholder="+880 1XXXXXXXXX"
                    pattern="(\+?88)?01[3-9][0-9]{8}"
                    title="Enter a valid Bangladeshi mobile number"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="checkout-card">
              <div className="checkout-section-heading">
                <span className="checkout-step">02</span>
                <div>
                  <h2>Shipping address</h2>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-field full-width">
                  <label htmlFor="address">Street address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={shipping.address}
                    onChange={handleShippingChange}
                    placeholder="House number, road, area and landmark"
                    rows="3"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="city">City / District</label>
                  <input
                    id="city"
                    name="city"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    placeholder="Your city or district"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="postalCode">Postal code</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    value={shipping.postalCode}
                    onChange={handleShippingChange}
                    placeholder="Postal code"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="checkout-card">
              <div className="checkout-section-heading">
                <span className="checkout-step">03</span>
                <div>
                  <h2>Delivery method</h2>
                  <p>Choose how you want your order delivered.</p>
                </div>
              </div>

              <div className="checkout-options">
                <label className={`checkout-option ${deliveryMethod === 'standard' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                  />
                  <span className="checkout-radio"></span>
                  <span className="checkout-option-content">
                    <strong>Standard Delivery</strong>
                    <small>Estimated 3–5 business days</small>
                  </span>
                  <strong className="checkout-option-price">৳120</strong>
                </label>

                <label className={`checkout-option ${deliveryMethod === 'express' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                  />
                  <span className="checkout-radio"></span>
                  <span className="checkout-option-content">
                    <strong>Express Delivery</strong>
                    <small>Estimated 1–2 business days</small>
                  </span>
                  <strong className="checkout-option-price">৳150</strong>
                </label>
              </div>
            </section>

            <section className="checkout-card">
              <div className="checkout-section-heading">
                <span className="checkout-step">04</span>
                <div>
                  <h2>Payment method</h2>
                  <p>Choose your preferred payment option.</p>
                </div>
              </div>

              <div className="checkout-options">
                <label className={`checkout-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span className="checkout-radio"></span>
                  <span className="checkout-payment-icon">৳</span>
                  <span className="checkout-option-content">
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives</small>
                  </span>
                </label>

                <label className={`checkout-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <span className="checkout-radio"></span>
                  <span className="checkout-payment-icon">▣</span>
                  <span className="checkout-option-content">
                    <strong>Online Payment</strong>
                    <small>SSLCOMMERZ integration coming soon</small>
                  </span>
                </label>
              </div>
            </section>
          </div>

          <aside className="checkout-summary">
            <div className="checkout-summary-heading">
              <div>
                <p className="checkout-eyebrow">YOUR SELECTION</p>
                <h2>Order Summary</h2>
              </div>
              <span>{cart.length} items</span>
            </div>

            <div className="checkout-summary-items">
              {cart.map((item) => (
                <div className="checkout-product" key={item.id}>
                  <div className="checkout-product-image">
                    <img src={item.image} alt={item.name} />
                    <span>{item.quantity}</span>
                  </div>

                  <div className="checkout-product-info">
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-price-details">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div>
                <span>Delivery</span>
                <strong>{formatPrice(deliveryCharge)}</strong>
              </div>

              <div className="checkout-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <button
              className="checkout-place-order"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
              <span>↗</span>
            </button>

            <p className="checkout-terms">
              By continuing, you agree to our terms and conditions.
            </p>

            {message && (
              <div className="checkout-message">
                {message}
              </div>
            )}

            <div className="checkout-assurance">
              <span>✓</span>
              <div>
                <strong>Safe & Secure</strong>
                <p>Your information is protected.</p>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <footer className="checkout-footer">
        <Link to="/">KICHU KINBEN</Link>
        <span>© 2026 All rights reserved.</span>
        <span>Thoughtfully selected, just for you.</span>
      </footer>
    </div>
  );
}

export default Checkout;
