import React from "react"
import { Form } from "react-router-dom"
import "./login.css"
import { useNavigate } from "react-router-dom"
import API_URL from "../config"
import { useEffect,useState } from "react"

export default  function Login() {
    const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: This tells the browser to accept and save the cookies sent by the backend
        credentials: "include", 
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.success) {
        // Check if user is admin and redirect accordingly
        if (data.user.admin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // Login Failed -> Show Alert
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.log("Network error", error);
      alert("Something went wrong. Please try again.");
    }
  };

    return (
        <div>
            <div className="login">
                <form className="login-form">
                    <div className="form-group">
                    <h2>Login</h2>
                    <label htmlFor="email"> Email ID</label>
                    <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e)=> setemail(e.target.value)}
                    />

                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                        type="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e)=>setpassword(e.target.value)}
                        />
                        
                    </div>

                    <button type="submit" className="login-button" 
                    onClick={handlesubmit}
                    >Login</button>
                    <div className="signup-link">
                         <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                    </div>

                    


                </form>

            </div>
        </div>
    )
}