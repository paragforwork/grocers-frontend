import "./nav.css"
import { Link } from "react-router-dom"
import {CircleUser} from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar(){
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/check-auth", {
                    credentials: "include",
                });
                const data = await response.json();
                if (data.isAuthenticated && data.user.admin) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Auth check error:", error);
            }
        };
        checkAdmin();
    }, []);

    return <>
    <div className="name">
        <div className="image1"><img src="/Grocers.png" /></div>
          <div className="text">
            <Link to="/" className="text">Home</Link></div>
       
        <div className="text">
            <Link to="/cakes" className="text">Cakes</Link></div>
         <div className="text">
            <Link to="/grocery" className="text">Grocery</Link></div>
         <div className="text">
            <Link to="/bread" className="text">Bread</Link></div>
       
        <div className="left-side">
            
        <Link to="/account"><CircleUser/></Link>
        <div className="image">
            <Link to="/cart">
                <img src="/cart.png" alt="cart" />
            </Link>
        </div>
        {isAdmin && (
            <button className="field admin-btn">
                <Link className="link" to="/admin">Admin Panel</Link>
            </button>
        )}
        <button className="field" >
           <Link className="link" to="/login">Login</Link> </button>
        <button className="field">
            <Link className="link" to="/signup">SignUp</Link></button>

        </div>
        
    </div>
    </>
}