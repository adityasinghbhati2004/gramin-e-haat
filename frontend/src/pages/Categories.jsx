import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Categories = ({ products, onAddToCart }) => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('none');
  const [loading, setLoading] = useState(true);

  const categoriesList = ['All', 'Handicrafts', 'Artifacts', 'Dresses', 'Pottery', 'Handloom', 'Jewelry', 'Art & Paintings', 'Decor'];

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortBy, products]);

  let filteredProducts = products;
  
  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => {
      // Basic matching
      const cat = p.category ? p.category.toLowerCase() : '';
      const selCat = selectedCategory.toLowerCase();
      return cat.includes(selCat) || selCat.includes(cat);
    });
  }

  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Categories</h1>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <select 
              className="btn btn-outline"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '8px 15px', backgroundColor: 'var(--card-bg)' }}
            >
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select 
              className="btn btn-outline"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px 15px', backgroundColor: 'var(--card-bg)' }}
            >
              <option value="none">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="skeleton skeleton-card"></div>)
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <h3>No products found in this category.</h3>
              <p>Try selecting a different category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
