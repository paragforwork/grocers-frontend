import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import API_URL from "../config";
import "./cart.css"; 
import { useNavigate } from "react-router-dom";
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchCart();
  }, []);

  // 1. Fetch Cart Data
  const fetchCart = async () => {
    try {
      // Ensure this matches your backend route (e.g., /cart or /cart/display)
      const response = await fetch(`${API_URL}/cart/display`, {
        method: "GET",
        credentials: "include",  
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCartItems(data.items || []); 
    } catch (err) {
      console.error(err);
      setError("Could not load cart. Please login.");
    } finally {
      setLoading(false);
    }
  };

  // 2. NEW: Remove Item Function
  const removeItem = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
        method: "DELETE", // Use DELETE method
        credentials: "include", // Send cookies
      });

      if (response.ok) {
        // Optimistic Update: Remove from screen immediately
        setCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId));
      } else {
        alert("Failed to delete item from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // 3. Calculate Total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0; 
      return total + price * item.quantity;
    }, 0);
  };
  const handleCheckout = () => {
    // We simply navigate to '/checkout'. 
    // The Checkout page's useEffect is already written to fetch the cart 
    // automatically if no 'singleItem' state is passed.
    navigate('/checkout');
  };

  if (loading) return <div>Loading Cart...</div>;
  if (error) return <div style={{textAlign:'center', marginTop: '50px'}}>{error}</div>;

  return (
    <div className="cart-page-wrapper">
      <Navbar />
      
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <a href="/products">Continue Shopping</a>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items List */}
            <div className="cart-items">
              {cartItems.map((item) => (
                // Safety check for null product
                item.product && (
                  <div key={item._id} className="cart-item">
                    <div className="item-image">
                      <img 
                          src={item.product.image.startsWith("http") ? item.product.image : `/${item.product.image}`} 
                          alt={item.product.name} 
                      />
                    </div>
                    
                    <div className="item-details">
                      {/* Flex container for Name + Delete Button */}
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                        <h3>{item.product.name}</h3>
                        
                        {/* --- DELETE BUTTON START --- */}
                        <button 
                          onClick={() => removeItem(item.product._id)}
                          title="Remove Item"
                          style={{
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: '#ff4d4d'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                        {/* --- DELETE BUTTON END --- */}
                      </div>

                      <p className="item-price">Price: ₹{item.product.price}</p>
                      
                      <div className="item-quantity">
                        <span>Quantity: {item.quantity}</span>
                      </div>
                    </div>

                    <div className="item-total">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Cart Summary Section */}
            <div className="cart-summary">
              <h3>Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}