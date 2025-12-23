import { useEffect, useState } from "react";
import API_URL from "../config";
import "./adminOrders.css";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const url = filter 
                ? `${API_URL}/admin/orders?status=${filter}`
                : `${API_URL}/admin/orders`;
            
            const response = await fetch(url, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderStatus: newStatus }),
            });
            const data = await response.json();
            if (data.success) {
                fetchOrders();
                alert("Order status updated successfully");
            }
        } catch (error) {
            console.error("Failed to update order:", error);
            alert("Failed to update order status");
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading orders...</div>;
    }

    return (
        <div className="admin-orders">
            <h1 className="admin-title">Order Management</h1>

            <div className="filter-section">
                <label>Filter by Status:</label>
                <select 
                    className="filter-select" 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="">All Orders</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for deleivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div>
                                <h3>Order #{order._id.slice(-8)}</h3>
                                <p className="order-customer">{order.user?.name} ({order.user?.email})</p>
                            </div>
                            <div className="order-amount">₹{order.totalAmount}</div>
                        </div>

                        <div className="order-items">
                            <h4>Items:</h4>
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="order-item">
                                    <span>{item.product?.name} x {item.quantity}</span>
                                    <span>₹{item.priceatpurchase}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-shipping">
                            <h4>Shipping Info:</h4>
                            <p>{order.shippingInfo?.fullname}</p>
                            <p>{order.shippingInfo?.address}, {order.shippingInfo?.city}</p>
                            <p>Phone: {order.shippingInfo?.phone}</p>
                        </div>

                        <div className="order-footer">
                            <div className="order-date">
                                {new Date(order.createdAt).toLocaleString()}
                            </div>
                            <div className="order-status-update">
                                <label>Status:</label>
                                <select
                                    className="status-select"
                                    value={order.orderStatus}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for deleivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
