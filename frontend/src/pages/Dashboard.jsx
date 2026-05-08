import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  createProduct,
  fetchAdminOrders,
  fetchAdminRoles,
  fetchAdminSummary,
  fetchAdminUsers,
  fetchComplaints,
  fetchSellerOrders,
  fetchSellerProducts,
  fetchUserOrders,
  resolveImageUrl,
  updateAdminUser,
  updateProduct,
  uploadProductImage
} from '../api';

const defaultProductForm = {
  name: '',
  description: '',
  price: '',
  category: 'Handicrafts',
  imageUrl: '',
  sourcePlatform: '',
  productUrl: '',
  stockQuantity: 0,
  isTrending: false
};

const CATEGORIES = ['Handicrafts', 'Artifacts', 'Dresses', 'Pottery', 'Handloom', 'Jewelry', 'Art & Paintings', 'Decor'];

const Dashboard = ({ user, onLogout, onProductChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = user?.role || 'BUYER';
  const initialTab = searchParams.get('tab') || (role === 'SELLER' ? 'products' : 'orders');
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState(null);

  const [form, setForm] = useState(defaultProductForm);
  const [productImageFile, setProductImageFile] = useState(null);
  const [editForms, setEditForms] = useState({});
  const [editImageFiles, setEditImageFiles] = useState({});

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const navigate = useNavigate();

  const tabs = useMemo(() => {
    const base = [
      { id: 'orders', label: 'My Purchases' },
      { id: 'complaints', label: 'Complaints' }
    ];
    if (role === 'SELLER') {
      return [
        { id: 'products', label: 'My Products' },
        { id: 'seller-orders', label: 'Received Orders' },
        ...base
      ];
    }
    if (role === 'ADMIN') {
      return [
        { id: 'users', label: 'Users' },
        { id: 'orders', label: 'All Orders' },
        { id: 'complaints', label: 'Complaints' },
        { id: 'analytics', label: 'Analytics' }
      ];
    }
    return base;
  }, [role]);

  useEffect(() => {
    if (!user) return;
    setError('');
    
    // Sync activeTab with URL param if it changes
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }

    if (activeTab === 'orders') {
      if (role === 'ADMIN') {
        fetchAdminOrders().then(setOrders).catch((err) => setError('Failed to load all orders: ' + err.message));
      } else {
        fetchUserOrders(user.id).then(setOrders).catch((err) => setError('Failed to load your orders: ' + err.message));
      }
    }

    if (activeTab === 'seller-orders' && role === 'SELLER') {
      fetchSellerOrders(user.id).then(setSellerOrders).catch((err) => setError('Failed to load received orders: ' + err.message));
    }

    if (activeTab === 'products' && role === 'SELLER') {
      fetchSellerProducts(user.id).then(setSellerProducts).catch((err) => setError('Failed to load products: ' + err.message));
    }

    if (role === 'ADMIN') {
      if (activeTab === 'users') {
        fetchAdminUsers().then(setUsers).catch((err) => setError('Failed to load users: ' + err.message));
        fetchAdminRoles().then(setRoles).catch((err) => console.error(err));
      }
      if (activeTab === 'complaints') {
        fetchComplaints().then(setComplaints).catch((err) => setError('Failed to load complaints: ' + err.message));
      }
      if (activeTab === 'analytics') {
        fetchAdminSummary().then(setSummary).catch((err) => setError('Failed to load summary: ' + err.message));
      }
    }
  }, [activeTab, role, user, searchParams]);

  if (!user) {
    return (
      <div className="section">
        <div className="container">
          <div className="empty-state">
            <h2>Please log in to access your account</h2>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/signup" className="btn btn-outline">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateProduct = (product) => {
    if (!product.name?.trim() || !product.category?.trim() || !product.price) {
      return 'Name, category and price are required.';
    }
    return null;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validateProduct(form);
    if (validationError) { setError(validationError); return; }

    try {
      setIsSavingProduct(true);
      let imageUrl = form.imageUrl;
      if (productImageFile) {
        const uploadResult = await uploadProductImage(productImageFile);
        imageUrl = uploadResult.imageUrl;
      }
      await createProduct({ ...form, imageUrl, price: Number(form.price), stockQuantity: Number(form.stockQuantity), sellerId: user.id });
      setForm(defaultProductForm);
      setProductImageFile(null);
      const products = await fetchSellerProducts(user.id);
      setSellerProducts(products);
      if (onProductChange) onProductChange();
      setSuccess('Product created.');
    } catch (err) { setError(err.message); } finally { setIsSavingProduct(false); }
  };

  const startEditProduct = (product) => {
    setEditForms(prev => ({
      ...prev,
      [product.id]: { ...product, isTrending: product.trending ?? product.isTrending ?? false }
    }));
  };

  const cancelEditProduct = (productId) => {
    setEditForms(prev => { const updated = { ...prev }; delete updated[productId]; return updated; });
  };

  const handleEditFormChange = (productId, e) => {
    const { name, value, type, checked } = e.target;
    setEditForms(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const handleSaveProductEdit = async (productId) => {
    setError('');
    setSuccess('');
    const edit = editForms[productId];
    if (!edit) return;
    try {
      setIsSavingProduct(true);
      let imageUrl = edit.imageUrl;
      if (editImageFiles[productId]) {
        const uploadResult = await uploadProductImage(editImageFiles[productId]);
        imageUrl = uploadResult.imageUrl;
      }
      await updateProduct(productId, { ...edit, imageUrl, price: Number(edit.price), stockQuantity: Number(edit.stockQuantity), sellerId: user.id });
      const products = await fetchSellerProducts(user.id);
      setSellerProducts(products);
      if (onProductChange) onProductChange();
      cancelEditProduct(productId);
      setSuccess('Product updated.');
    } catch (err) { setError(err.message); } finally { setIsSavingProduct(false); }
  };

  const handleAdminUserUpdate = async (id, updates) => {
    setError('');
    setSuccess('');
    try {
      await updateAdminUser(id, updates);
      const updated = await fetchAdminUsers();
      setUsers(updated);
      setSuccess('User updated.');
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Dashboard</h1>
        <div style={{ marginBottom: '20px', color: 'var(--text-light)' }}>
          Signed in as <strong>{user.name}</strong> ({role})
        </div>

        <div className="dashboard-layout">
          <div className="sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
              >
                {tab.label}
              </button>
            ))}
            <button className="sidebar-link" style={{ color: 'var(--danger)', marginTop: '20px' }} onClick={handleLogout}>Logout</button>
          </div>

          <div className="dashboard-content">
            {error && <div className="auth-error" style={{ marginBottom: '10px' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', marginBottom: '10px' }}>{success}</div>}

            {activeTab === 'orders' && (
              <div>
                <h2>{role === 'ADMIN' ? 'All Orders' : 'My Purchases'}</h2>
                {orders.length === 0 ? <div className="empty-state">No orders found.</div> : (
                  <table className="table">
                    <thead><tr><th>Order ID</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>₹{order.totalAmount?.toFixed(2)}</td>
                          <td><span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'seller-orders' && (
              <div>
                <h2>Received Orders</h2>
                {sellerOrders.length === 0 ? <div className="empty-state">No orders received yet.</div> : (
                  <table className="table">
                    <thead><tr><th>Order ID</th><th>Total</th><th>Status</th><th>Customer Address</th></tr></thead>
                    <tbody>
                      {sellerOrders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>₹{order.totalAmount?.toFixed(2)}</td>
                          <td><span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                          <td>{order.shippingAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>My Products</h2>
                </div>
                <form className="form-card" onSubmit={handleCreateProduct}>
                  <div className="form-grid">
                    <label className="auth-label">Name<input className="auth-input" name="name" value={form.name} onChange={handleProductChange} /></label>
                    <label className="auth-label">Category
                      <select className="auth-input" name="category" value={form.category} onChange={handleProductChange}>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </label>
                    <label className="auth-label">Price<input className="auth-input" name="price" type="number" value={form.price} onChange={handleProductChange} /></label>
                    <label className="auth-label">Stock<input className="auth-input" name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleProductChange} /></label>
                    <label className="auth-label">Image URL<input className="auth-input" name="imageUrl" value={form.imageUrl} onChange={handleProductChange} /></label>
                    <label className="auth-label">Upload File<input className="auth-input" type="file" onChange={(e) => setProductImageFile(e.target.files?.[0])} /></label>
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={isSavingProduct}>{isSavingProduct ? 'Saving...' : 'Add Product'}</button>
                </form>
                <table className="table" style={{ marginTop: '20px' }}>
                  <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
                  <tbody>
                    {sellerProducts.map(p => (
                      <tr key={p.id}>
                        <td><img src={resolveImageUrl(p.imageUrl)} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px' }} /></td>
                        <td>{p.name}</td><td>₹{p.price}</td><td>{p.stockQuantity}</td>
                        <td><button className="btn btn-outline" onClick={() => startEditProduct(p)}>Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && role === 'ADMIN' && (
               <div>
                 <h2>User Management</h2>
                 <table className="table">
                   <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th></tr></thead>
                   <tbody>
                     {users.map(u => (
                       <tr key={u.id}>
                         <td>{u.name}</td><td>{u.email}</td><td>
                           <select className="auth-input" value={u.role} onChange={(e) => handleAdminUserUpdate(u.id, { role: e.target.value })}>
                             {roles.map(r => <option key={r} value={r}>{r}</option>)}
                           </select>
                         </td>
                         <td><input type="checkbox" checked={u.sellerVerified} onChange={(e) => handleAdminUserUpdate(u.id, { sellerVerified: e.target.checked })} /></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}

            {activeTab === 'analytics' && role === 'ADMIN' && summary && (
              <div className="stats-grid">
                <div className="card"><h3>Users</h3><p>{summary.users}</p></div>
                <div className="card"><h3>Orders</h3><p>{summary.orders}</p></div>
                <div className="card"><h3>Complaints</h3><p>{summary.complaints}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
