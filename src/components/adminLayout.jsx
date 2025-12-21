import { Link, Outlet } from "react-router-dom";
import "./adminLayout.css";

export default function AdminLayout() {
    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <img src="/Grocers.png" alt="Grocers Admin" />
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-link">Dashboard</Link>
                    <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
                    <Link to="/admin/products" className="admin-nav-link">Products</Link>
                    <Link to="/admin/users" className="admin-nav-link">Users</Link>
                    <Link to="/" className="admin-nav-link back-link">Back to Store</Link>
                </nav>
            </div>
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
}
