import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Palette, Scissors, Tent, Gem, Image } from 'lucide-react';

const Home = ({ products, onAddToCart }) => {
  const loading = products.length === 0;

  const trendingProducts = products.filter(p => Boolean(p.trending ?? p.isTrending));
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Discover Authentic Rural Craftsmanship</h1>
          <p>
            Explore a curated collection of handmade artifacts, traditional dresses, and rural art items. 
            Support artisans across India by shopping directly through trusted platforms.
          </p>
          <div style={{ marginTop: '30px' }}>
            <Link to="/categories" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Category Preview */}
      <section className="section bg-color">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/categories?cat=Handicrafts" className="category-card">
              <Scissors className="category-icon" size={40} />
              <div className="category-name">Handicrafts</div>
            </Link>
            <Link to="/categories?cat=Artifacts" className="category-card">
              <Palette className="category-icon" size={40} />
              <div className="category-name">Artifacts</div>
            </Link>
            <Link to="/categories?cat=Pottery" className="category-card">
              <Tent className="category-icon" size={40} />
              <div className="category-name">Pottery</div>
            </Link>
            <Link to="/categories?cat=Jewelry" className="category-card">
              <Gem className="category-icon" size={40} />
              <div className="category-name">Jewelry</div>
            </Link>
            <Link to="/categories?cat=Art" className="category-card">
              <Image className="category-icon" size={40} />
              <div className="category-name">Rural Art</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="product-grid">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="skeleton skeleton-card"></div>)
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section bg-color">
        <div className="container">
          <h2 className="section-title">Trending Right Now</h2>
          <div className="product-grid">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="skeleton skeleton-card"></div>)
            ) : (
              trendingProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
