import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchProducts } from './api';
import './index.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const fetchAllProducts = () => {
    fetchProducts().then(data => {
      setProducts(data);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar cartCount={totalCartItems} onSearch={setSearchQuery} user={user} onLogout={handleLogout} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={<Home products={filteredProducts} onAddToCart={handleAddToCart} />} 
            />
            <Route
              path="/product/:id"
              element={<ProductDetails onAddToCart={handleAddToCart} user={user} />}
            />
            <Route 
              path="/categories" 
              element={<Categories products={filteredProducts} onAddToCart={handleAddToCart} />} 
            />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cart={cart} 
                  onUpdateQuantity={handleUpdateQuantity} 
                  onRemove={handleRemoveFromCart}
                  products={products}
                  onAddToCart={handleAddToCart}
                  user={user}
                  onClearCart={handleClearCart}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={<Dashboard user={user} onLogout={handleLogout} onProductChange={fetchAllProducts} />} 
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact user={user} />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={setUser} />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/dashboard" replace /> : <Signup onSignup={setUser} />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
