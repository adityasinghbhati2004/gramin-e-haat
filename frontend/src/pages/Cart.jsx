import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { createOrder, resolveImageUrl, createRazorpayOrder, fetchRazorpayKey } from '../api';

const Cart = ({ cart, onUpdateQuantity, onRemove, products, onAddToCart, user, onClearCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 50) : 0;
  const total = subtotal + shipping;
  const [selectedAddress, setSelectedAddress] = useState(() => user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Similar products logic (random 4 for suggestion)
  const similarProducts = products.filter(p => !cart.find(c => c.id === p.id)).slice(0, 4);

  if (cart.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="empty-state">
            <ShoppingBag size={80} style={{ margin: '0 auto 20px', color: 'var(--text-light)' }} />
            <h2 style={{ marginBottom: '15px' }}>Your Cart is Empty</h2>
            <p style={{ marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/categories" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setError('');
    setSuccess('');
    if (!user) {
      setError('Please log in to place an order.');
      return;
    }
    if (!selectedAddress) {
      setError('Please select a shipping address.');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const orderPayload = {
        userId: user.id,
        paymentMethod,
        shippingAddress: selectedAddress,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      if (paymentMethod === 'UPI') {
        if (!window.Razorpay) {
          setError('Razorpay SDK not loaded. Please refresh the page.');
          setIsSubmitting(false);
          return;
        }

        // Fetch order and key in parallel
        const [razorpayOrder, key] = await Promise.all([
          createRazorpayOrder(total),
          fetchRazorpayKey()
        ]);

        const options = {
          key: key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || "INR",
          name: "Gramin E-Haat Bazaar",
          description: "Purchase from Artisans",
          order_id: razorpayOrder.id,
          handler: async function () {
            try {
              await createOrder(orderPayload);
              onClearCart();
              setIsSubmitting(false);
              navigate('/dashboard?tab=orders');
            } catch (err) {
              setError(err.message || 'Order creation failed after payment');
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ""
          },
          theme: {
            color: "#ff4757"
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          setError(`Payment Failed: ${response.error.description}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        await createOrder(orderPayload);
        onClearCart();
        setIsSubmitting(false);
        navigate('/dashboard?tab=orders');
      }
    } catch (err) {
      setError(err.message || 'Checkout failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Your Cart</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  {item.sourcePlatform && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '8px' }}>
                      Fulfilled via {item.sourcePlatform}
                    </div>
                  )}
                  <div className="cart-item-price">₹{item.price}</div>
                </div>
                
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                    <Minus size={14} />
                  </button>
                  <span style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  className="btn btn-outline" 
                  style={{ color: 'var(--danger)', borderColor: 'transparent', padding: '10px' }}
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 style={{ marginBottom: '20px', fontWeight: '700' }}>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="summary-row" style={{ marginTop: '20px' }}>
              <select
                className="btn btn-outline"
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-color)' }}
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="">Select Address</option>
                {user && user.address && (
                  <option value={user.address}>Registered Address: {user.address}</option>
                )}
                <option value="Home: 123 Main St, New Delhi">Home: 123 Main St, New Delhi</option>
                <option value="Work: Tech Park, Bangalore">Work: Tech Park, Bangalore</option>
              </select>
            </div>

            <div className="summary-row">
              <select
                className="btn btn-outline"
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-color)' }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI (Razorpay Checkout)</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            {error && (
              <div style={{ color: 'var(--danger)', marginBottom: '12px', fontSize: '0.9rem' }}>
                {error} {!user && <Link to="/login">Login</Link>}
              </div>
            )}
            {success && (
              <div style={{ color: 'var(--success)', marginBottom: '12px', fontSize: '0.9rem' }}>
                {success}
              </div>
            )}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '15px' }}
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Proceed to Buy'}
            </button>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h2 className="section-title">Similar Product Suggestions</h2>
            <div className="product-grid">
              {similarProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
