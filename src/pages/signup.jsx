import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";
// import "./login.css"; // Ensure this file exists

export default function Signup() {
    // 1. Add state for Full Name
    const [fullName, setFullName] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: fullName, // 2. Send Full Name to backend
                    email: email,
                    password: password
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                // Success: Redirect to login
                alert(data.message);
                navigate("/login"); 
            } else {
                // Error: Show message
                alert(data.message || "Signup failed");
            }

        } catch (error) {
            console.error("Signup error", error);
            alert("Could not connect to server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="login">
                <form className="login-form" onSubmit={handlesubmit}>
                    <div className="form-group">
                        <h2>Sign Up</h2>

                        {/* 3. Add Input Field for Full Name */}
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input 
                                type="text" 
                                className="placeholder"
                                id="fullName"
                                placeholder="Enter Your Full Name"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <label htmlFor="email"> Email ID</label>
                        <input 
                            type="email" 
                            className="placeholder"
                            id="email"
                            placeholder="Enter Your Email Id"
                            required
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            className="placeholder"
                            type="password"
                            id="password"
                            placeholder="Enter your Password"
                            required
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                    
                    <div className="signup-link">
                        <p>Already have an Account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}