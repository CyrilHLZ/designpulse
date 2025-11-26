import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../../Components/Navbar";
import DesignOverlay from "../../Components/Design/DesignOverlay";
import "../../Styles/Shop/OrderProductPage.css";
import {createOrder} from "../../Services/AdminPanel/AdminPanelPageAPI";
import {AuthContext} from "../../Components/Users/AuthContext";

const OrderProductPage = () => {
    const [designData, setDesignData] = useState(null);
    const [formData, setFormData] = useState({
        address: "",
        postalCode: "",
        city: "",
        country: "",
        phone: ""
    });
    const [orderNumber, setOrderNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleConfirmOrder = async () => {
        if (!designData) return;
        
        setLoading(true);

        const OrderDTO = {
            number: orderNumber,
            price: designData.productData.price,
            quantity: 1,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            email: user?.email, 
            phone: formData.phone,
            status: "EN_ATTENTE",
            categoryId: designData.productData.category?.id,
            productId: designData.productData.id,
            
            };

        try {
            const savedOrder = await createOrder(OrderDTO);
            console.log("✅ Commande créée :", savedOrder);
            console.log("📦 Données envoyées au backend :", OrderDTO);
            console.log("📦 Category ID:", designData.productData.category?.id);
            console.log("📦 Product complet:", designData.productData);
            
            // Nettoyer le localStorage après commande
            localStorage.removeItem("designData");
            localStorage.removeItem("orderData");
            
            alert(`🎉 Commande confirmée !\nNuméro : ${savedOrder.number}`);
            navigate("/");
        } catch (error) {
            console.error("❌ La commande n'a pas pu être enregistrée", error);
            alert("❌ Erreur lors de la confirmation de la commande");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/Shop");
    }

    const generateOrderNumber = () => {
        return Math.floor(Math.random() * 90000000) + 10000000;
    }

    useEffect(() => {
        const savedDesignData = localStorage.getItem("designData");
        const savedOrderData = localStorage.getItem("orderData");
        
        if (savedDesignData) {
            setDesignData(JSON.parse(savedDesignData));
        }
        
        if (savedOrderData) {
            const orderData = JSON.parse(savedOrderData);
            setFormData(orderData.formData);
        }

        setOrderNumber(generateOrderNumber());
    }, []);

    return (
        <>
            <Navbar />
            <div className="order-container">
                <h2 className="order-title">Récapitulatif de la commande</h2>

                {designData && (
                    <div className="container-product-infos">
                        {/* Aperçu du produit - GESTION DE L'IMAGE CONSERVÉE */}
                        <DesignOverlay
                            imageUrl={designData.productData.imageUrl}
                            design={designData.overlay.url}
                            position={designData.overlay.position}
                            scale={designData.overlay.scale}
                            editable={false}
                        />

                        {/* Récapitulatif de commande */}
                        <div className="order-summary">
                            <h3>Détails de la commande</h3>
                            
                            <div className="order-info">
                                <div className="info-item">
                                    <span className="info-label">Numéro de commande</span>
                                    <span className="info-value order-number">#{orderNumber}</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="info-label">Produit</span>
                                    <span className="info-value">{designData.productData.name}</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="info-label">Prix</span>
                                    <span className="info-value price">{designData.productData.price} €</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="info-label">Adresse</span>
                                    <span className="info-value">{formData.address}</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="info-label">Code Postal</span>
                                    <span className="info-value">{formData.postalCode}</span>
                                </div>
                                
                                <div className="info-item">
                                    <span className="info-label">Ville</span>
                                    <span className="info-value">{formData.city}</span>
                                </div>
                                
                                {formData.country && (
                                    <div className="info-item">
                                        <span className="info-label">Pays</span>
                                        <span className="info-value">{formData.country}</span>
                                    </div>
                                )}
                                
                                {formData.phone && (
                                    <div className="info-item">
                                        <span className="info-label">Téléphone</span>
                                        <span className="info-value">{formData.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="order-actions">
                                <button 
                                    className="btn-confirm" 
                                    onClick={handleConfirmOrder}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Confirmation...
                                        </>
                                    ) : (
                                        "✅ Confirmer la commande"
                                    )}
                                </button>

                                <button className="btn-back" onClick={handleBack}>
                                    ↩️ Retour à la boutique
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrderProductPage;