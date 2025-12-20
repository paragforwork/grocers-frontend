import { useEffect, useState } from "react";
import Cakecard from "../components/cakecard";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import "./cakes.css";
import { Link } from "react-router-dom";

export default function Cakes() {
  const [cakes, setCakes] = useState([]);
  const [error, setError] = useState(null); // New state to handle permission errors
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await fetch("http://localhost:8080/products", {
          // --- OPTION 2 FIX: SEND COOKIES ---
          // This allows the backend to see your 'accessToken' cookie
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        // Safety Check: Is the data actually an array?
        if (Array.isArray(data)) {
          setCakes(data);
        } else {
          // If backend returns { message: "Unauthorized..." }, we catch it here
          setError(data.message || "Please login to view our cakes.");
        }
      } catch (error) {
        console.error("Error fetching cakes:", error);
        setError("Something went wrong. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  return (
    <div>
      <Navbar />
      <h1 className="heading">Our Speciality Cakes</h1>

      {/* ERROR MESSAGE DISPLAY */}
      {error ? (
        <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
          <h2>Access Denied</h2>
          <p>{error}</p>
          <p>Please <Link to="/login">Login</Link> to continue.</p>
        </div>
      ) : (
        /* SUCCESS DISPLAY */
        <div className="cake-list">
          {loading ? (
             <p style={{ textAlign: "center", width: "100%" }}>Loading delicious cakes...</p>
          ) : (
             cakes.map((cake) => (
                <Link to={`/products/${cake._id}`} key={cake._id} className="cake-link">
                  <div className="cake-box">
                    <Cakecard
                      name={cake.name}
                      price={cake.price}
                      // Handle missing or broken images safely
                      imgsrc={cake.image} 
                    />
                  </div>
                </Link>
             ))
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}