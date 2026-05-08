import { Link } from 'react-router-dom';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { resolveImageUrl } from '../api';

const ProductCard = ({ product, onAddToCart }) => {
  const getPlatformClass = (platform) => {
    if (!platform) return '';
    const p = platform.toLowerCase();
    if (p.includes('amazon')) return 'platform-amazon';
    if (p.includes('flipkart')) return 'platform-flipkart';
    if (p.includes('meesho')) return 'platform-meesho';
    return 'platform-amazon'; // default
  };

  const handleExternalClick = () => {
    if (product.productUrl) {
      window.open(product.productUrl, '_blank');
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} style={{ position: 'relative' }}>
        <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="product-img" />
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        {product.sourcePlatform && (
          <div>
            <span className={`platform-badge ${getPlatformClass(product.sourcePlatform)}`}>
              {product.sourcePlatform}
            </span>
          </div>
        )}
        
        <div className="product-price">₹{product.price}</div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button 
            className="btn btn-outline" 
            style={{ flex: 1, fontSize: '0.9rem', padding: '8px' }}
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart size={16} />
            Add
          </button>
          <button 
            className="btn btn-primary" 
            style={{ flex: 1, fontSize: '0.9rem', padding: '8px' }}
            onClick={handleExternalClick}
            disabled={!product.productUrl}
          >
            Buy <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
