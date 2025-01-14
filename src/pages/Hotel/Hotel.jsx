import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './productCards.scss';
import Sidebar from '../../components/sidebar/Sidebar';

const Hotel = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editData, setEditData] = useState({});
    const [newImage, setNewImage] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`http://localhost:4000/api/products/${productId}`);
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedData = { ...editData };
            if (newImage) {
                const formData = new FormData();
                formData.append('image', newImage);
                const imageResponse = await axios.post('http://localhost:4000/api/upload', formData);
                updatedData.photo = imageResponse.data.url;
            }

            await axios.put(`http://localhost:4000/api/products/${editingProductId}`, updatedData);
            setEditingProductId(null);
            setEditData({});
            setNewImage(null);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="outer-container">
            <a href="/addProduct" className="button">Add Product</a>
            
            <div className="product-cards-container">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        {editingProductId === product.id ? (
                            <form onSubmit={handleUpdate}>
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={editData.name || product.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={editData.description || product.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={editData.category || product.category}
                                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={editData.storeLocation || product.storeLocation}
                                    onChange={(e) => setEditData({ ...editData, storeLocation: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Total Quantity"
                                    value={editData.totalQuantity || product.totalQuantity}
                                    onChange={(e) => setEditData({ ...editData, totalQuantity: e.target.value })}
                                />
                                <input type="file" onChange={handleImageChange} />
                                <button type="submit" className="btn-primary">Update Product</button>
                            </form>
                        ) : (
                            <>
                                {product.photo ? (
                                    <img src={product.photo} className="product-image" alt="Product" />
                                ) : (
                                    <p>No image available</p>
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p><strong>Description:</strong> {product.description}</p>
                                    <p><strong>Category:</strong> {product.category}</p>
                                    <p><strong>Location:</strong> {product.storeLocation}</p>
                                    <p><strong>Contact:</strong> {product.contact}</p>
                                    <p><strong>Total Quantity:</strong> {product.totalQuantity}</p>
                                    <button onClick={() => {
                                        setEditingProductId(product.id);
                                        setEditData(product);
                                    }} className="btn-primary">Update</button>
                                    <button onClick={() => handleDelete(product.id)} className="btn-danger">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hotel;
