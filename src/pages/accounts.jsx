import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import "./account.css";

export default function Accounts() {
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [postalCode, setpostalCode] = useState("");
  const [loading, setloading] = useState(true);

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/accounts/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          setname(data.user.name || "");
          setemail(data.user.email || "");
          setphone(data.user.phone || "");
          setaddress(data.user.address || "");
          setcity(data.user.city || "");
          setpostalCode(data.user.postalCode || "");
        } else if (response.status === 401) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setloading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle Form Submission
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/accounts/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          phone: phone,
          address: address,
          city: city,
          postalCode: postalCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Profile Updated Successfully!");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleLogout = () => {
    // Add any cookie clearing logic here if needed
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      
      <div className="account-container">
        <h1 className="account-heading">My Account</h1>

        {/* PROFILE FORM */}
        <form className="account-section profile-info" onSubmit={handlesubmit}>
          <h2>Profile Information</h2>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              title="Email cannot be changed"
              style={{ cursor: "not-allowed", backgroundColor: "#e9ecef" }} // Minimal visual cue for readonly
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              placeholder="Mobile Number"
            />
          </div>

          <div className="input-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              placeholder="House No, Street, Area"
            />
          </div>

          <div className="input-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setcity(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="postalCode">Pincode</label>
            <input
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={(e) => setpostalCode(e.target.value)}
            />
          </div>

          <button type="submit" className="save-button">Save Changes</button>
        </form>

        {/* ORDER HISTORY LINK */}
        <div className="account-section my-orders-link-section">
          <Link to="/myorders" className="orders-link">
            <h2>View My Orders</h2>
          </Link>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="account-section logout-section">
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}