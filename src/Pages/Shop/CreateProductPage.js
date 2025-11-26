import React, {useEffect, useState} from "react";
import { createProduct } from "../../Services/Shop/ProductAPI";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import {fetchCategories} from "../../Services/Shop/CategoryAPI";
import {getUserRole} from "../../Components/Users/AuthUtils";

const CreateProductPage = () => {
    const navigate = useNavigate();
    const role = getUserRole()
    const isADMIN = role === "ADMIN";
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        size: "",
        imageFile: "",
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error("Erreur lors du chargement des catégories :", err);
            }
        };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                imageFile: file,
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createProduct(formData);
            console.log("Le produit a été créé :", response);
            setFormData({
                name: "",
                description: "",
                price: "",
                quantity: "",
                category: "",
                size: "",
            });
            navigate("/shop");
        } catch (error) {
            console.error("Erreur lors de la création du produit :", error);
        }
    };

    const BackShop = () => navigate("/shop");

    return (
        <>
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
                <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "800px", borderRadius: "20px", marginBottom: "30px", marginTop: "20px" }}>
                    <h2 className="text-center mb-4" style={{ background: "linear-gradient(90deg, var(--or-pale), var(--or-brillant))",WebkitBackgroundClip: "text",WebkitTextFillColor: "transparent",backgroundClip: "text"}}>Créer un nouveau produit</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nom</label>
                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" name="description" placeholder="Décrivez le produit" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="size">Size :</label>
                            <input type="text" name="size" id="size" placeholder="size" className="form-control" value={formData.size} onChange={handleChange} required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Prix (€)</label>
                            <input type="number" className="form-control" id="price" name="price" placeholder="Ex : 00.00" value={formData.price} onChange={handleChange} step="0.01" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="quantity" className="form-label">Quantité</label>
                            <input type="number" className="form-control" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required/>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="form-label">Catégorie</label>
                            <select className="form-select" id="category" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">-- Sélectionner une catégorie --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="image" className="form-label">Image du produit</label>
                            <input type="file" className="form-control" id="image" accept="image/*" onChange={handleImageChange} />
                        </div>

                        <div className="d-flex justify-content-between">
                            {isADMIN && (
                            <button type="submit" className="btn btn-success px-4 shadow-sm">Créer</button>
                            )}
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={BackShop}>Retour</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProductPage;
