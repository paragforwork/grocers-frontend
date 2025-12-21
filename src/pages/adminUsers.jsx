import { useEffect, useState } from "react";
import "./adminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/admin/users", {
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading users...</div>;
    }

    return (
        <div className="admin-users">
            <h1 className="admin-title">User Management</h1>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || "N/A"}</td>
                                <td>{user.city || "N/A"}</td>
                                <td>
                                    <span className={`admin-badge ${user.admin ? 'is-admin' : 'not-admin'}`}>
                                        {user.admin ? "Yes" : "No"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
