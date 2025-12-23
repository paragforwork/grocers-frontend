import { useEffect, useState } from "react";
import Cakecard from "../components/cakecard";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import API_URL from "../config";
import "./cakes.css";
import { Link } from "react-router-dom";

export default function Cakes() {
  const [cakes, setCakes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await fetch(`${API_URL}/products`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          const cakeProducts = data.filter(product => 
            product.category === 'cake' || !product.category
          );
          setCakes(cakeProducts);
        } else {
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

  const filteredCakes = cakes.filter((cake) =>
    cake.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      {/* --- BLOCK 1: SEARCH SECTION --- */}
      {/* Visual gap controlled by .search-section margin */}
      {!error && !loading && (
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search for your favorite cake..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* --- BLOCK 2: HEADING SECTION --- */}
      {/* Completely separate div with its own background */}
      <div className="heading-container">
        <h1 className="heading">Our Speciality Cakes</h1>
      </div>

      {/* --- BLOCK 3: CONTENT --- */}
      {error ? (
        <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
          <h2>Access Denied</h2>
          <p>{error}</p>
          <p>Please <Link to="/login">Login</Link> to continue.</p>
        </div>
      ) : (
        <div className="cake-list">
          {loading ? (
             <p style={{ textAlign: "center", width: "100%", fontSize: "1.2rem" }}>Loading delicious cakes...</p>
          ) : (
             filteredCakes.length > 0 ? (
               filteredCakes.map((cake) => (
                <Link to={`/products/${cake._id}`} key={cake._id} className="cake-link">
                  <div className="cake-box">
                    <Cakecard
                      name={cake.name}
                      price={cake.price}
                      imgsrc={cake.image} 
                    />
                  </div>
                </Link>
               ))
             ) : (
               <div style={{ textAlign: "center", width: "100%", marginTop: "20px" }}>
                  <p style={{ fontSize: "1.5rem", color: "#888" }}>😕</p>
                  <p>No cakes found matching "{searchQuery}"</p>
               </div>
             )
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}