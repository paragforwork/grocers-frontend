import Navbar from "./navbar";
import Footer from "./footer";
import { useParams, useNavigate } from "react-router-dom"; // 1. Added useNavigate
import API_URL, { getImageUrl } from "../config";
import "./product.css"
import { useState, useEffect } from "react";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate(); // 2. Initialize navigate hook

  const [cake, setCake] = useState(null) // Changed to null for better loading check
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setCake(data);
        // fetch comments for this product
        fetchComments(data._id || id);

      } catch (error) {
        console.error("Error fetching cake:", error);
      }
    };

    fetchCakes();
  }, [id]) // Added dependency array [id]

  async function fetchComments(productId) {
    try {
      const res = await fetch(`${API_URL}/products/${productId}/comments`,{
        credentials: 'include',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }

  // --- ADD TO CART LOGIC (Existing) ---
  async function handleclick() {
    if (!cake) return;

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: cake._id,
          quantity: 1
        }),
      });

      if (response.ok) {
        alert("Added to cart successfully!");
      } else {
        if (response.status === 401) {
          alert("Please login to add items to cart.");
        } else {
          alert("Failed to add to cart");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  // --- BUY NOW LOGIC (New) ---
  async function handleBuyNow() {
    if (!cake) return;

    // Direct Buy: We do NOT call the backend /cart/add API here.
    // We navigate to checkout and carry the item data in 'state'.
    navigate('/checkout', {
      state: {
        singleItem: {
          product: cake._id,
          name: cake.name,
          price: cake.price,
          image: cake.image,
          quantity: 1
        }
      }
    });
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!newCommentText.trim()) return alert('Comment cannot be empty');

    try {
      const res = await fetch(`${API_URL}/products/${id}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newCommentText, rating: newRating })
      });

      if (res.status === 401) return alert('Please login to post a comment');

      if (!res.ok) throw new Error('Failed to post comment');

      const created = await res.json();
      // prepend new comment
      setComments(prev => [created, ...prev]);
      setNewCommentText('');
      setNewRating(5);
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    }
  }

  if (!cake) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="product-page">
        <div className="product-image-container">
          <img
            src={getImageUrl(cake.image)}
            alt={cake.name}
            className="product-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = '#e0e0e0';
              e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;">No Image</div>';
            }}
          />
        </div>

        <div className="product-details">
          <h1 className="product-name">{cake.name}</h1>
          <p className="product-price">₹{cake.price}</p>
          <p className="product-description">{cake.description}</p>
          
          {/* Action Buttons Container */}
          <div className="product-actions">
            <button 
              className="add-to-cart-button"
              onClick={handleclick}
            >
              Add to Cart
            </button>

            {/* Buy Now Button */}
            <button 
              className="add-to-cart-button"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="comments-section">
        <h2>Reviews</h2>

        <form className="comment-form" onSubmit={submitComment}>
          <label>Rating:
            <select value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <textarea placeholder="Write your review..." value={newCommentText} onChange={e => setNewCommentText(e.target.value)} />
          <button type="submit">Post Review</button>
        </form>

        <div className="comments-list">
          {comments.length === 0 && <p>No reviews yet.</p>}
          {comments.map(c => (
            <div key={c._id} className="comment-item">
              <div className="comment-header">
                <strong>{c.user?.name || 'Anonymous'}</strong>
                <span className="comment-rating">{c.rating ? `⭐${c.rating}` : ''}</span>
                <span className="comment-date">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}