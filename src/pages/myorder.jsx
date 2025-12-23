import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import API_URL, { getImageUrl } from '../config';
import './myorder.css';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/order/myorders`, {
                    method: 'GET',
                    credentials: 'include', // Important: Sends cookies to backend
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (response.ok) {
                    setOrders(data.orders);
                } else {
                    setError(data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError('Something went wrong. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Helper to pick color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#388e3c'; // Green
            case 'Cancelled': return '#d32f2f'; // Red
            case 'Shipped': return '#1976d2';   // Blue
            case 'Out for deleivery': return '#fbc02d'; // Yellow/Orange
            default: return '#fb641b'; // Processing (Default Orange)
        }
    };

    if (loading) return <div className="loading-container">Loading your orders...</div>;

    return (
        <div className="page-wrapper">
            <Navbar />
            
            <div className="my-orders-container">
                <h1 className="page-title">My Orders</h1>

                {error && <div className="error-message">{error}</div>}

                {!loading && !error && orders.length === 0 ? (
                    <div className="no-orders">
                        <p>You haven't placed any orders yet.</p>
                        <a href="/products" className="shop-now-btn">Start Shopping</a>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                
                                {/* 1. Order Header: Date & Status */}
                                <div className="order-header">
                                    <div className="order-info">
                                        <span className="order-id">Order ID: {order._id}</span>
                                        <span className="order-date">
                                            Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="order-status">
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* 2. Order Items List */}
                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item-row">
                                            <div className="item-image">
                                                {/* Safety Check: If product was deleted from DB */}
                                                {item.product ? (
                                                    <img 
                                                        src={getImageUrl(item.product.image)} 
                                                        alt={item.product.name} 
                                                    />
                                                ) : (
                                                    <div className="placeholder-img">N/A</div>
                                                )}
                                            </div>
                                            <div className="item-details">
                                                <h4>{item.product ? item.product.name : 'Product Unavailable'}</h4>
                                                <p>Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="item-price">
                                                ₹{item.priceatpurchase * item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 3. Order Footer: Address & Total */}
                                <div className="order-footer">
                                    <div className="shipping-summary">
                                        <strong>Shipping To:</strong> {order.shippingInfo.fullname}, {order.shippingInfo.city}
                                    </div>
                                    <div className="order-total">
                                        <span>Total:</span>
                                        <span className="amount">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}  