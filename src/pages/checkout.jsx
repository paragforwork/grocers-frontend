import Navbar from "./../components/navbar";
import Footer from "./../components/footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // FIX 1: Update State keys to match Backend Schema exactly
  const [shippingInfo, setShippingInfo] = useState({
    fullname: "",   // Added this because backend requires it
    address: "",
    city: "",
    postalcode: "", // Changed from 'pincode'
    phone: ""       // Changed from 'phoneNo'
  });
  
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // --- LOAD DATA ---
  useEffect(() => {
    const buyNowItem = location.state?.singleItem;

    if (buyNowItem) {
      const formattedItem = {
        product: buyNowItem.product,
        name: buyNowItem.name,
        price: buyNowItem.price,
        image: buyNowItem.image,
        quantity: buyNowItem.quantity
      };
      setItems([formattedItem]);
      setTotalPrice(formattedItem.price * formattedItem.quantity);
      setLoading(false);
    } 
    else {
      fetchCartItems();
    }
  }, [location.state]);

  const fetchCartItems = async () => {
    try {
      const res = await fetch("http://localhost:8080/cart/display", {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (data && data.items) {
        const formattedItems = data.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        }));

        setItems(formattedItems);
        const total = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalPrice(total);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };
 const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingInfo.fullname || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalcode || !shippingInfo.phone) {
      alert("Please fill in all shipping details.");
      return;
    }

    const orderPayload = {
      items: items.map(item => ({
        product: item.product, 
        quantity: item.quantity
      })),
      shippingInfo: shippingInfo, 
      paymentInfo: { method: paymentMethod }
    };

    try {
      // 1. Create the Order
      const response = await fetch("http://localhost:8080/order/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (response.ok) {
        // --- NEW LOGIC START ---
        
        // Check: Did we come from "Buy Now"?
        // If location.state.singleItem exists, it was a "Buy Now" (Direct Purchase).
        // In that case, we DO NOT clear the cart.
        const isBuyNow = location.state?.singleItem;

        if (!isBuyNow) {
            // If it was a standard Cart checkout, clear the database cart now.
            try {
                await fetch("http://localhost:8080/cart/clear", {
                    method: "DELETE",
                    credentials: "include"
                });
            } catch (clearErr) {
                console.error("Failed to clear cart:", clearErr);
                // We don't stop the user here because the order was already placed.
            }
        }
        // --- NEW LOGIC END ---

        alert("Order Placed Successfully!");
        //navigate("/myorders"); // Redirect to orders page
      } else {
        alert(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <h1 className="page-title">Finalize Your Order</h1>
        
        <div className="checkout-layout">
          
          <div className="order-details-container">
            <h2>Items in Your Order</h2>
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="product-card">
                  <div className="image-wrapper">
                    <img src={`/${item.image}`} alt={item.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{item.name}</h3>
                    <p className="product-qty">Quantity: {item.quantity}</p>
                    <p className="product-price">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-row"><span>Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="price-row"><span>Shipping</span><span className="free-text">Free</span></div>
              <div className="divider"></div>
              <div className="price-row total"><span>Grand Total</span><span>₹{totalPrice}</span></div>
            </div>
          </div>

          <div className="shipping-payment-container">
            
            <div className="section-box">
              <h3>Shipping Address</h3>
              <form className="address-form">
                
                {/* FIX 2: Added Full Name Input */}
                <input 
                  type="text" 
                  name="fullname" 
                  placeholder="Full Name" 
                  value={shippingInfo.fullname} 
                  onChange={handleInputChange} 
                />

                <input 
                  type="text" name="address" placeholder="Address / Street" 
                  value={shippingInfo.address} onChange={handleInputChange} 
                />
                <input 
                  type="text" name="city" placeholder="City" 
                  value={shippingInfo.city} onChange={handleInputChange} 
                />
                
                {/* FIX 3: Updated name attributes */}
                <input 
                  type="text" 
                  name="postalcode" 
                  placeholder="Postal Code" 
                  value={shippingInfo.postalcode} 
                  onChange={handleInputChange} 
                />
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="Phone Number" 
                  value={shippingInfo.phone} 
                  onChange={handleInputChange} 
                />
              </form>
            </div>

            <div className="section-box">
              <h3>Payment Method</h3>
              <div className="payment-selector">
                <label className={paymentMethod === 'COD' ? 'selected' : ''}>
                  <input 
                    type="radio" name="payment" value="COD" 
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  Cash on Delivery
                </label>
                <label className={paymentMethod === 'Online' ? 'selected' : ''}>
                  <input 
                    type="radio" name="payment" value="Online"
                    checked={paymentMethod === 'Online'}
                    onChange={() => setPaymentMethod('Online')}
                  />
                  Online Payment
                </label>
              </div>
            </div>

            <button className="confirm-btn" onClick={handlePlaceOrder}>
              Place Order - ₹{totalPrice}
            </button>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}