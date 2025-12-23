import Navbar from "./../components/navbar";
import Footer from "./../components/footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API_URL, { getImageUrl } from "../config";
import "./checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    fullname: "",
    address: "",
    city: "",
    postalcode: "",
    phone: ""
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
      const res = await fetch(`${API_URL}/cart/display`, {
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

    try {
      // ============================================
      // STEP 1: Create Order in DB as "Pending"
      // ============================================
      const createOrderRes = await fetch(`${API_URL}/order/create-pending`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map(item => ({
            product: item.product,
            quantity: item.quantity
          })),
          shippingInfo: shippingInfo,
          paymentMethod: paymentMethod
        })
      });

      const orderData = await createOrderRes.json();

      if (!orderData.success) {
        alert(orderData.message || "Failed to create order");
        return;
      }

      const orderId = orderData.orderId;
      const amount = orderData.totalAmount;

      // ============================================
      // STEP 2: If COD, confirm and finish
      // ============================================
      if (paymentMethod === 'COD') {
        await confirmOrder(orderId, null, 'COD');
        return;
      }

      // ============================================
      // STEP 3: If Online, create Razorpay order
      // ============================================
      const razorpayRes = await fetch(`${API_URL}/order/create-razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, amount })
      });

      const razorpayData = await razorpayRes.json();

      if (!razorpayData.success) {
        alert("Failed to initiate payment");
        return;
      }

      // ============================================
      // STEP 4: Open Razorpay Checkout
      // ============================================
      const options = {
        key: razorpayData.key_id,
        amount: razorpayData.razorpayOrder.amount,
        currency: razorpayData.razorpayOrder.currency,
        name: "Grocers Store",
        description: `Order #${orderId}`,
        order_id: razorpayData.razorpayOrder.id,
        handler: async function (response) {
          // Payment successful
          await confirmOrder(
            orderId,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
            'Online'
          );
        },
        prefill: {
          name: shippingInfo.fullname,
          contact: shippingInfo.phone
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            alert("Payment cancelled. Your order is saved as pending.");
            navigate("/myorders");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        alert("Payment failed. Your order is saved, you can retry payment later.");
        navigate("/myorders");
      });

      rzp.open();

    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // ============================================
  // Confirm Payment & Clear Cart
  // ============================================
  const confirmOrder = async (orderId, paymentDetails, paymentMethod) => {
    try {
      const confirmRes = await fetch(`${API_URL}/order/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          ...paymentDetails,
          paymentMethod
        })
      });

      const confirmData = await confirmRes.json();

      if (confirmData.success) {
        // Clear cart only if it wasn't a "Buy Now" action
        const isBuyNow = location.state?.singleItem;
        if (!isBuyNow) {
          try {
            await fetch(`${API_URL}/cart/clear`, {
              method: "DELETE",
              credentials: "include"
            });
          } catch (clearErr) {
            console.error("Failed to clear cart:", clearErr);
          }
        }

        alert("Order placed successfully!");
        navigate("/myorders");
      } else {
        alert(confirmData.message || "Payment verification failed");
        navigate("/myorders"); // Still navigate - order exists
      }

    } catch (error) {
      console.error("Confirmation Error:", error);
      alert("Order created but confirmation failed. Check your orders page.");
      navigate("/myorders");
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
                    <img src={getImageUrl(item.image)} alt={item.name} />
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
