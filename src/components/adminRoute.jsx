import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminRoute() {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/check-auth", {
                    credentials: "include",
                });
                const data = await response.json();
                
                if (data.isAuthenticated && data.user.admin) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Admin check error:", error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
