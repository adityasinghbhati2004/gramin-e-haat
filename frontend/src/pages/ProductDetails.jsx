import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createReview, fetchProductById, fetchProductReviews, resolveImageUrl } from '../api';

const ProductDetails = ({ onAddToCart, user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProductById(id).then(setProduct).catch(() => setError('Failed to load product'));
    fetchProductReviews(id).then(setReviews).catch(() => {});
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user) {
      setError('Please log in to submit a review.');
      return;
    }
    if (!comment.trim()) {
      setError('Please enter a review comment.');
      return;
    }
    try {
      const newReview = await createReview({
        productId: Number(id),
        userId: user.id,
        rating,
        comment
      });
      setReviews(prev => [newReview, ...prev]);
      setComment('');
      setSuccess('Review submitted.');
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  if (!product) {
    return (
      <div className="section">
        <div className="container">
          <div className="empty-state">Loading product...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="product-details">
          <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="product-details-img" />
          <div>
            <h1 className="section-title" style={{ marginBottom: '10px' }}>{product.name}</h1>
            <div style={{ color: 'var(--text-light)', marginBottom: '10px' }}>{product.category}</div>
            <div className="product-price" style={{ fontSize: '1.5rem' }}>₹{product.price}</div>
            <p style={{ margin: '20px 0', color: 'var(--text-light)' }}>{product.description}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => onAddToCart(product)}>Add to Cart</button>
              {product.productUrl && (
                <button className="btn btn-outline" onClick={() => window.open(product.productUrl, '_blank')}>
                  Buy on {product.sourcePlatform || 'Marketplace'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2 className="section-title">Reviews</h2>
          <form className="form-card" onSubmit={handleReviewSubmit}>
            <label className="auth-label">
              Rating
              <select className="auth-input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="auth-label">
              Comment
              <textarea className="auth-input" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />
            </label>
            {error && <div className="auth-error">{error}</div>}
            {success && <div style={{ color: 'var(--success)' }}>{success}</div>}
            <button className="btn btn-primary" type="submit">Submit Review</button>
          </form>

          <div style={{ marginTop: '20px' }}>
            {reviews.length === 0 ? (
              <div className="empty-state">No reviews yet.</div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="card">
                  <div style={{ fontWeight: 600 }}>Rating: {review.rating}</div>
                  <div style={{ color: 'var(--text-light)' }}>{review.comment}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
