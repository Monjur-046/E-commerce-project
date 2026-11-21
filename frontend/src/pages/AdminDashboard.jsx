
import {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import {formatPrice} from '../data/products';

function AdminDashboard() {
  const {user, login} = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [adminsLoading, setAdminsLoading] = useState(true);

  const [message, setMessage] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [accountMessage, setAccountMessage] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updatingAccount, setUpdatingAccount] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [statusChanges, setStatusChanges] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });

  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  });

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [adminEditData, setAdminEditData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load products');
      }

      setProducts(data.products || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load orders');
      }

      setOrders(data.orders || []);

      const initialStatuses = {};

      (data.orders || []).forEach((order) => {
        initialStatuses[order._id] = order.orderStatus;
      });

      setStatusChanges(initialStatuses);
    } catch (error) {
      setOrderMessage(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load admins');
      }

      setAdmins(data.admins || []);
    } catch (error) {
      setAdminMessage(error.message);
    } finally {
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchAdmins();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      const response = await fetch(
        editingId
          ? `http://localhost:5000/api/products/${editingId}`
          : 'http://localhost:5000/api/products',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Product operation failed');
      }

      setMessage(data.message);

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: ''
      });

      setEditingId(null);
      fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      image: product.image,
      stock: String(product.stock)
    });

    setMessage('');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      setMessage(data.message);
      fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: ''
    });

    setMessage('');
  };

  const handleAccountChange = (event) => {
    setAccountData({
      ...accountData,
      [event.target.name]: event.target.value
    });
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    setAccountMessage('');

    const payload = {
      currentPassword: accountData.currentPassword
    };

    if (accountData.name.trim() !== user.name) {
      payload.name = accountData.name.trim();
    }

    if (accountData.email.trim().toLowerCase() !== user.email.toLowerCase()) {
      payload.email = accountData.email.trim();
    }

    if (accountData.newPassword) {
      payload.newPassword = accountData.newPassword;
    }

    if (!payload.name && !payload.email && !payload.newPassword) {
      setAccountMessage('Please change at least one account detail');
      return;
    }

    setUpdatingAccount(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/admin/account',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Account update failed');
      }

      login(data.user, token);

      setAccountData({
        name: data.user.name,
        email: data.user.email,
        currentPassword: '',
        newPassword: ''
      });

      setAccountMessage(data.message);
    } catch (error) {
      setAccountMessage(error.message);
    } finally {
      setUpdatingAccount(false);
    }
  };

  const handleNewAdminChange = (event) => {
    setNewAdmin({
      ...newAdmin,
      [event.target.name]: event.target.value
    });
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    setAdminMessage('');
    setCreatingAdmin(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/admin/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newAdmin)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create admin');
      }

      setAdminMessage(data.message);

      setNewAdmin({
        name: '',
        email: '',
        password: ''
      });

      fetchAdmins();
    } catch (error) {
      setAdminMessage(error.message);
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleAdminEdit = (adminUser) => {
    setEditingAdminId(adminUser._id);

    setAdminEditData({
      name: adminUser.name,
      email: adminUser.email,
      password: ''
    });

    setAdminMessage('');
  };

  const handleAdminEditChange = (event) => {
    setAdminEditData({
      ...adminEditData,
      [event.target.name]: event.target.value
    });
  };

  const handleUpdateAdmin = async (event) => {
    event.preventDefault();
    setAdminMessage('');

    const payload = {
      name: adminEditData.name.trim(),
      email: adminEditData.email.trim()
    };

    if (adminEditData.password) {
      payload.password = adminEditData.password;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/admin/${editingAdminId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update admin');
      }

      setAdminMessage(data.message);
      setEditingAdminId(null);

      setAdminEditData({
        name: '',
        email: '',
        password: ''
      });

      fetchAdmins();
    } catch (error) {
      setAdminMessage(error.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this admin account?'
    );

    if (!confirmed) return;

    setAdminMessage('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/admin/${adminId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete admin');
      }

      setAdminMessage(data.message);
      fetchAdmins();
    } catch (error) {
      setAdminMessage(error.message);
    }
  };

  const handleStatusChange = (orderId, status) => {
    setStatusChanges((previous) => ({
      ...previous,
      [orderId]: status
    }));
  };

  const handleUpdateOrder = async (orderId) => {
    setUpdatingOrderId(orderId);
    setOrderMessage('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            orderStatus: statusChanges[orderId]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order');
      }

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      setOrderMessage(data.message);
    } catch (error) {
      setOrderMessage(error.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const currentAdminId = user?._id || user?.id;

  return (
    <main className="auth-page admin-page">
      <div className="admin-dashboard">

        <section className="admin-overview">
          <div className="admin-overview-heading">
            <div>
              <span className="admin-eyebrow">KICHU KINBEN / ADMIN</span>
              <h1>Dashboard Overview</h1>
              <p>Welcome back, {user.name}. Manage your store from here.</p>
            </div>

            <div className="admin-welcome-icon">
              KK.
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Products</span>
                <span className="admin-stat-symbol">↗</span>
              </div>
              <h2>{loading ? '...' : products.length}</h2>
              <p>Total products in store</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Orders</span>
                <span className="admin-stat-symbol">▣</span>
              </div>
              <h2>{ordersLoading ? '...' : orders.length}</h2>
              <p>Total customer orders</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Administrators</span>
                <span className="admin-stat-symbol">♙</span>
              </div>
              <h2>{adminsLoading ? '...' : admins.length}</h2>
              <p>Store administrators</p>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">YOUR ACCOUNT</span>
              <h2>Account Settings</h2>
              <p>Update your administrator account details.</p>
            </div>
          </div>

          <div className="admin-profile-grid">
            <div className="admin-profile-item">
              <span>Admin Name</span>
              <strong>{user.name}</strong>
            </div>

            <div className="admin-profile-item">
              <span>Email Address</span>
              <strong>{user.email}</strong>
            </div>

            <div className="admin-profile-item">
              <span>Account Type</span>
              <strong className="admin-role">{user.role}</strong>
            </div>
          </div>

          <form onSubmit={handleAccountSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Admin Name</label>
                <input
                  name="name"
                  value={accountData.name}
                  onChange={handleAccountChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={accountData.email}
                  onChange={handleAccountChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={accountData.currentPassword}
                  onChange={handleAccountChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={accountData.newPassword}
                  onChange={handleAccountChange}
                  placeholder="Leave blank to keep current password"
                  minLength="6"
                />
              </div>
            </div>

            <button type="submit" disabled={updatingAccount}>
              {updatingAccount ? 'Updating...' : 'Update My Account'}
            </button>

            {accountMessage && (
              <p className="admin-feedback" role="status">{accountMessage}</p>
            )}
          </form>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">TEAM ACCESS</span>
              <h2>Admin Management</h2>
              <p>Create and manage store administrators.</p>
            </div>

            <span className="admin-count">{admins.length} Admins</span>
          </div>

          <div className="admin-subsection">
            <h3>Create New Admin</h3>

            <form onSubmit={handleCreateAdmin}>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Admin Name</label>
                  <input
                    name="name"
                    value={newAdmin.name}
                    onChange={handleNewAdminChange}
                    placeholder="Enter admin name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleNewAdminChange}
                    placeholder="Enter admin email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Temporary Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newAdmin.password}
                    onChange={handleNewAdminChange}
                    placeholder="At least 6 characters"
                    minLength="6"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={creatingAdmin}>
                {creatingAdmin ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>
          </div>

          {adminMessage && (
            <p className="admin-feedback" role="status">{adminMessage}</p>
          )}

          <div className="admin-subsection">
            <h3>All Administrators</h3>

            {adminsLoading ? (
              <p>Loading administrators...</p>
            ) : admins.length === 0 ? (
              <p>No administrators found.</p>
            ) : (
              <div className="admin-list-grid">
                {admins.map((adminUser) => (
                  <div className="admin-person-card" key={adminUser._id}>
                    {editingAdminId === adminUser._id ? (
                      <form onSubmit={handleUpdateAdmin}>
                        <h4>Edit Administrator</h4>

                        <div className="form-group">
                          <label>Name</label>
                          <input
                            name="name"
                            value={adminEditData.name}
                            onChange={handleAdminEditChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={adminEditData.email}
                            onChange={handleAdminEditChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>New Password</label>
                          <input
                            type="password"
                            name="password"
                            value={adminEditData.password}
                            onChange={handleAdminEditChange}
                            placeholder="Leave blank to keep current password"
                            minLength="6"
                          />
                        </div>

                        <div className="admin-actions">
                          <button type="submit">Save Changes</button>
                          <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={() => setEditingAdminId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="admin-person-top">
                          <div className="admin-avatar">
                            {adminUser.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <h4>{adminUser.name}</h4>
                            <span className="admin-role">Administrator</span>
                          </div>
                        </div>

                        <p>{adminUser.email}</p>

                        {String(adminUser._id) === String(currentAdminId) ? (
                          <span className="admin-current-label">
                            Current Account
                          </span>
                        ) : (
                          <div className="admin-actions">
                            <button
                              type="button"
                              onClick={() => handleAdminEdit(adminUser)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={() => handleDeleteAdmin(adminUser._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">STORE INVENTORY</span>
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <p>Add a new item or update an existing product.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>

              <div className="form-group admin-full-width">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter product image URL"
                  required
                />
              </div>

              <div className="form-group admin-full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                />
              </div>
            </div>

            <div className="admin-actions">
              <button type="submit">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {message && (
              <p className="admin-feedback" role="status">{message}</p>
            )}
          </form>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">YOUR CATALOG</span>
              <h2>Manage Products</h2>
              <p>View and manage all products in your store.</p>
            </div>

            <span className="admin-count">{products.length} Products</span>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products available yet.</p>
          ) : (
            <div className="admin-product-grid">
              {products.map((product) => (
                <div className="admin-product-card" key={product._id}>
                  <div className="admin-product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="admin-product-details">
                    <span className="admin-product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <strong>{formatPrice(product.price)}</strong>

                    <p>Available stock: {product.stock}</p>

                    <div className="admin-actions">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">CUSTOMER ACTIVITY</span>
              <h2>Order Management</h2>
              <p>Track orders and update their delivery status.</p>
            </div>

            <span className="admin-count">{orders.length} Orders</span>
          </div>

          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No customer orders available yet.</p>
          ) : (
            <div className="admin-order-grid">
              {orders.map((order) => (
                <div className="admin-order-card" key={order._id}>
                  <div className="admin-order-heading">
                    <div>
                      <span>ORDER ID</span>
                      <h3>#{order._id.slice(-8).toUpperCase()}</h3>
                    </div>

                    <span className={`admin-order-status ${order.orderStatus}`}>
                      {order.orderStatus}
                    </span>
                  </div>
<div className="admin-order-info">
  <p>
    <span>Customer</span>
    <strong>{order.user?.name || order.shippingAddress?.fullName || 'Unknown'}</strong>
  </p>

  <p>
    <span>Email</span>
    <strong>{order.user?.email || order.shippingAddress?.email || 'Unavailable'}</strong>
  </p>

  <p>
    <span>Phone Number</span>
    <strong>{order.shippingAddress?.phone || 'Unavailable'}</strong>
  </p>

  <p>
    <span>Full Address</span>
    <strong>
      {order.shippingAddress?.address || 'Address unavailable'}
    </strong>
  </p>

  <p>
    <span>City / District</span>
    <strong>{order.shippingAddress?.city || 'Unavailable'}</strong>
  </p>

  <p>
    <span>Postal Code</span>
    <strong>{order.shippingAddress?.postalCode || 'Unavailable'}</strong>
  </p>

  <p>
    <span>Order Date</span>
    <strong>
      {new Date(order.createdAt).toLocaleDateString()}
    </strong>
  </p>

  <p>
    <span>Payment Method</span>
    <strong>{order.paymentMethod?.toUpperCase()}</strong>
  </p>

  <p>
    <span>Payment Status</span>
    <strong>{order.paymentStatus}</strong>
  </p>
</div>

                  <div className="admin-order-items">
                    <h4>Ordered Products</h4>

                    {order.items.map((item, index) => (
                      <div
                        className="admin-order-product"
                        key={item._id || `${order._id}-${index}`}
                      >
                        <img src={item.image} alt={item.name} />

                        <div>
                          <strong>{item.name}</strong>
                          <p>
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-order-total">
                    <p>
                      <span>Subtotal</span>
                      <strong>{formatPrice(order.subtotal)}</strong>
                    </p>

                    <p>
                      <span>Delivery</span>
                      <strong>{formatPrice(order.deliveryCharge)}</strong>
                    </p>

                    <div>
                      <span>Total Amount</span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </div>

                  <div className="admin-order-update">
                    <label>Update Order Status</label>

                    <select
                      value={statusChanges[order._id] || order.orderStatus}
                      onChange={(event) =>
                        handleStatusChange(order._id, event.target.value)
                      }
                      disabled={order.orderStatus === 'cancelled'}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleUpdateOrder(order._id)}
                      disabled={
                        updatingOrderId === order._id ||
                        order.orderStatus === 'cancelled' ||
                        statusChanges[order._id] === order.orderStatus
                      }
                    >
                      {updatingOrderId === order._id
                        ? 'Updating...'
                        : 'Update Order'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orderMessage && (
            <p className="admin-feedback" role="status">{orderMessage}</p>
          )}
        </section>

        <footer className="admin-footer">
          <span>KICHU KINBEN.</span>
          <p>Admin Control Panel</p>
        </footer>

      </div>
    </main>
  );
}

export default AdminDashboard;
