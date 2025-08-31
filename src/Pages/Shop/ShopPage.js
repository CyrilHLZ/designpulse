import { AllProducts, deleteProduct as deleteProductAPI } from "../../Services/Shop/ProductAPI";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../../Components/Navbar";
import {getUserRole} from "../../Components/Users/AuthUtils";
import {getCurrentUser} from "../../Components/Users/AuthUtils";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../Styles/Shop/ShopPage.css";


const ShopPage = () => {
    const [products, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const role = getUserRole();
    const isADMIN = role === "ADMIN";
    const isUSER = role === "USER";
    const user = getCurrentUser();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await AllProducts();
                setProduct(productsData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await deleteProductAPI(productId);
            setProduct(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = (productId) => {
        navigate(`/UpdateProduct/${productId}`);
    };

    const goToDetailsProductPage = (productId) => {
        navigate(`/DetailsProductPage/${productId}`);
    };

    const createProduct = () => {
        navigate(`/CreateProduct`);
    };

    const sortAZ = () => {
        setProduct([...products].sort((a, b) => a.name.localeCompare(b.name)));
    };

    const sortZA = () => {
        setProduct([...products].sort((a, b) => b.name.localeCompare(a.name)));
    };

    return (
        <>
            <div style={{ backgroundColor: "bisque" }}>
                <Navbar />
                <div className="container-fluid">
                    <div className="fond_de_page">
                        {/* Sidebar */}
                        <div className="menu col-md-3 sidebar p-3">
                            <h4 className="mt-3 mb-3 text-center text-black text-decoration-underline">Menu</h4>
                            <button className="btn btn-light w-100 mb-2" onClick={sortAZ}>Trier A-Z</button>
                            <button className="btn btn-light w-100 mb-2" onClick={sortZA}>Trier Z-A</button>
                                {isADMIN && (
                                <button className="btn btn-success w-100" onClick={createProduct}>Créer un produit</button>
                                )}
                        </div>

                        {/* Contenu principal */}
                        <div className="col-md-9 content text-center">
                            <h2 className="my-4">Salut {user?.name || user?.lastname || "Utilisateur"} ! Bienvenue dans la boutique</h2>
                            {loading ? (
                                <p>Chargement...</p>
                            ) : error ? (
                                <p className="text-danger">{error}</p>
                            ) : (
                                <div className="row">
                                    {products.map(product => (
                                        <div className="col-md-4 mb-4" key={product.id}>
                                            <div className="card h-100 shadow-sm">
                                                <img
                                                    src={product.image ? `http://localhost:8080/upload/${product.image}` : "https://via.placeholder.com/300x200"}
                                                    className="card-img-top"
                                                    alt={product.name}
                                                    style={{ height: "500px", objectFit: "cover" }}
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{product.name}</h5>
                                                    <p className="card-text">{product.price} €</p>
                                                    <div className="mt-auto">
                                                        <button className="btn btn-primary w-100 mb-2" disabled={!isADMIN && !isUSER} onClick={() => {
                                                                if (isADMIN || isUSER) {
                                                                    goToDetailsProductPage(product.id);
                                                                }
                                                            }}
                                                        >
                                                            Choisir ce produit
                                                        </button>
                                                        {!isADMIN && !isUSER && (
                                                            <small className="text-danger">Connectez-vous pour accéder à ce produit</small>
                                                        )}
                                                        {isADMIN && (
                                                            <>
                                                                <button className="btn btn-warning w-100 mb-2" onClick={() => handleUpdate(product.id)}>
                                                                    Modifier
                                                                </button>
                                                                <button className="btn btn-danger w-100" onClick={() => handleDelete(product.id)}>
                                                                    Supprimer
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopPage;
