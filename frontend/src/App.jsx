import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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

  const filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar cartCount={totalCartItems} onSearch={setSearchQuery} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={<Home products={filteredProducts} onAddToCart={handleAddToCart} />} 
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
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={<Dashboard />} 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
