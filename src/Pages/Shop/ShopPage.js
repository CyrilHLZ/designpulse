import { AllProducts, deleteProduct as deleteProductAPI } from "../../Services/Shop/ProductAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { getUserRole } from "../../Components/Users/AuthUtils";
import { getCurrentUser } from "../../Components/Users/AuthUtils";

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
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            try {
                await deleteProductAPI(productId);
                setProduct(prev => prev.filter(p => p.id !== productId));
            } catch (error) {
                setError(error.message);
            }
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

    const InventoryPage = () => {
        navigate(`/InventoryProductPage`);
    };

    return (
        <>
            <Navbar />
            <div className="fond_de_page">
                <div className="container-fluid">
                    <div className="row">
                        {/* Sidebar Élégante FIXE */}
                        <div className="sidebar">
                            <div className="menu">
                                <h4>Menu Boutique</h4>
                                <button className="btn btn-light w-100 mb-2" onClick={sortAZ}>
                                    📊 Trier A-Z
                                </button>
                                <button className="btn btn-light w-100 mb-2" onClick={sortZA}>
                                    📊 Trier Z-A
                                </button>
                                {isADMIN && (
                                    <button className="btn btn-success w-100 mt-2" onClick={createProduct}>
                                        ✨ Créer un produit
                                    </button>
                                )}
                                <button className="btn btn-success w-100 mt-2" onClick={InventoryPage}>
                                    Inventaire
                                </button>
                            </div>
                        </div>

                        {/* Contenu Principal */}
                        <div className="content">
                            <h2>
                                Bonjour {user?.name || user?.lastname || "cher client"} ! 
                                <br />
                                <small style={{ fontSize: '1.1rem', color: 'var(--taupe)', fontWeight: '300' }}>
                                    Découvrez nos créations exclusives
                                </small>
                            </h2>
                            
                            {loading ? (
                                <div className="loading-text">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="spinner-border text-warning me-3" role="status">
                                            <span className="visually-hidden">Chargement...</span>
                                        </div>
                                        <span>Chargement de nos créations...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <p className="error-text">❌ {error}</p>
                            ) : (
                                <div className="products-grid">
                                    {products.map(product => (
                                        <div className="card-wrapper" key={product.id}>
                                            <div className="card h-100">
                                                <img
                                                    src={product.image ? `http://localhost:8080/upload/${product.image}` : "https://via.placeholder.com/300x200"}
                                                    className="card-img-top"
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/300x200/FAF0E6/8A7F6F?text=Image+Non+Disponible";
                                                    }}
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{product.name}</h5>
                                                    <p className="card-text">{product.price} €</p>
                                                    <div className="mt-auto">
                                                        <button 
                                                            className="btn btn-primary w-100 mb-2" 
                                                            disabled={!isADMIN && !isUSER} 
                                                            onClick={() => {
                                                                if (isADMIN || isUSER) {
                                                                    goToDetailsProductPage(product.id);
                                                                }
                                                            }}
                                                        >
                                                            🎨 Choisir ce design
                                                        </button>
                                                        {!isADMIN && !isUSER && (
                                                            <small className="text-danger d-block text-center">
                                                                🔒 Connectez-vous pour accéder
                                                            </small>
                                                        )}
                                                        {isADMIN && (
                                                            <>
                                                                <button 
                                                                    className="btn btn-warning w-100 mb-2" 
                                                                    onClick={() => handleUpdate(product.id)}
                                                                >
                                                                    ✏️ Modifier
                                                                </button>
                                                                <button 
                                                                    className="btn btn-danger w-100" 
                                                                    onClick={() => handleDelete(product.id)}
                                                                >
                                                                    🗑️ Supprimer
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