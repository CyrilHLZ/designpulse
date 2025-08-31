import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateProduct, ProductById } from "../../Services/Shop/ProductAPI";
import Navbar from "../../Components/Navbar";
import {getCurrentUser, getUserRole} from "../../Components/Users/AuthUtils";

const UpdateProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const role = getUserRole();
    const isADMIN = role === "ADMIN";
    const [product, setProduct] = useState({
        name: "",
        image: "",
        price: "",
        description: "",
        quantity: "",
        size: ""
    });
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await ProductById(productId);
                setProduct(productData);


                setImagePreview(`http://localhost:8080/upload/${productData.image}`);
            } catch (error) {
                console.error("Erreur lors de la récupération du produit", error);
                setError(error);
            }
        };

        fetchProduct();
    }, [productId]); // le code s’exécute quand l’ID du produit change

    // 🖊️ Quand tu tapes dans les champs texte
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProduct(prev => ({ ...prev, image: file }));

        // 🔍 Montre un aperçu à l’utilisateur AVANT l'envoi
        setImagePreview(URL.createObjectURL(file));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(productId, product); // envoie le produit mis à jour à l'API
            navigate("/shop");
        } catch (error) {
            console.error("Le produit n'a pas pu être mis à jour", error);
            setError(error);
        }
    };

    const BackShop = () => navigate("/shop");

    // Affichage conditionnel si problème
    if (error) return <p>{error.message}</p>;
    if (!product) return <p>Chargement du produit...</p>;

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: "50px", marginBottom: "10px" }}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow p-4">
                            <h2 className="text-center mb-4">Modifier un produit</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name">Nom :</label>
                                    <input type="text" name="name" value={product.name} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description">Description :</label>
                                    <input type="text" name="description" value={product.description} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price">Prix :</label>
                                    <input type="number" name="price" value={product.price} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quantity">Quantité :</label>
                                    <input type="number" name="quantity" value={product.quantity} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="size">Size :</label>
                                    <input type="text" name="size" value={product.size} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image">Image :</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                                    {imagePreview && (
                                        <div className="mt-3 text-center">
                                            <img src={imagePreview} alt="Aperçu" style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }} />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-around">
                                    {isADMIN && (
                                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                                    )}
                                    <button type="button" className="btn btn-secondary" onClick={BackShop}>Retour</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateProductPage;
