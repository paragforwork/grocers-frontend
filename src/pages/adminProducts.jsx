import { useEffect, useState } from "react";
import "./adminProducts.css";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        image: ""
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:8080/admin/products", {
                credentials: "include",
            });
            const data = await response.json();
          //  console.log("Fetched products:", data);
            if (data.success) {
              //  console.log("Products array:", data.products);
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const url = editingProduct
                ? `http://localhost:8080/admin/products/${editingProduct._id}`
                : "http://localhost:8080/admin/products";
            
            const method = editingProduct ? "PUT" : "POST";

            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("description", formData.description);
            
            if (imageFile) {
                formDataToSend.append("image", imageFile);
            } else if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const response = await fetch(url, {
                method,
                credentials: "include",
                body: formDataToSend,
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                fetchProducts();
                resetForm();
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Failed to save product");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`http://localhost:8080/admin/products/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                alert("Product deleted successfully");
                fetchProducts();
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description || "",
            image: product.image || ""
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ name: "", price: "", description: "", image: "" });
        setImageFile(null);
        setEditingProduct(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="admin-loading">Loading products...</div>;
    }

    return (
        <div className="admin-products">
            <div className="products-header">
                <h1 className="admin-title">Product Management</h1>
                <button className="cta-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Add New Product"}
                </button>
            </div>

            {showForm && (
                <form className="product-form" onSubmit={handleSubmit}>
                    <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Price (₹) *</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        {imageFile && <p className="file-name">Selected: {imageFile.name}</p>}
                        {editingProduct && formData.image && !imageFile && (
                            <p className="current-image">Current: {formData.image}</p>
                        )}
                    </div>
                    <button type="submit" className="submit-button">
                        {editingProduct ? "Update Product" : "Create Product"}
                    </button>
                </form>
            )}

            <div className="products-grid">
                {products.map((product) => {
                    // console.log("Rendering product:", product.name, "Image URL:", product.image);
                    return (
                    <div key={product._id} className="product-card">
                        <div className="product-image-container">
                            {product.image && product.image.trim() !== "" ? (
                                <img 
                                    src={product.image.startsWith('http') ? product.image : `/${product.image.replace(/^\.?\/?/, '')}`}
                                    alt={product.name} 
                                    className="product-image"
                                    // onLoad={() => console.log("Image loaded successfully:", product.image)}
                                    onError={(e) => {
                                        // console.error("Image failed to load:", product.image);
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) {
                                            e.target.nextSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div className="product-image-placeholder" style={{ display: (product.image && product.image.trim() !== "") ? 'none' : 'flex' }}>
                                No Image
                            </div>
                        </div>
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <p className="product-price">₹{product.price}</p>
                            <p className="product-description">{product.description}</p>
                            <div className="product-actions">
                                <button className="edit-btn" onClick={() => handleEdit(product)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
}
