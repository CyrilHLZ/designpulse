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

    const handleBack = () => {
        navigate("/Shop");
    }

    const generateOrderNumber = () => {
        return Math.floor(Math.random() * 90000000) + 10000000;
    }

    const convertBlobToBase64 = async (blobUrl) => {
        try {
            console.log("Début de la convertion du blob vers la base64");

            // fetch qui traitre la requete HTTP
            const response = await fetch(blobUrl);

            // Conversion du blob 
            const blob = await response.blob();
            console.log("Blob récupéré, de la taille", blob.size);

            // FileReader = API javaScript qui permet de lire les fichiers
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                // Lecture est terminée, renvoie du résultat
                reader.onloadend = () => {
                    console.log("Conversion terminée, taille Base64:", reader.result.length, "caractères");
                    resolve(reader.result);
            }

            // En cas d'erreur
            reader.onerror = reject;

            // readAsDataURL génère automatiquement le format en base64
            reader.readAsDataURL(blob);
        });
        } catch (error) {
            console.error("Erreur lors de la convertion", error);
            return null;
        }
    };

    const handleConfirmOrder = async () => {
        if (!designData) return;
        
        setLoading(true);

        // Fonctions pour formater les dates
        const formatDateForBackend = (date) => {
            return date.toISOString().split('T')[0]; // "2024-01-15"
        };

        const now = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(now.getDate() + 7); // +7 jours

        let designUrlToSend = designData.overlay.url;

        if (designData.overlay.url.startsWith('blob:')) {
            console.log("Détection d'un Blob URL, convertion en base64...");
            
            // Appel de la fonction pour convertion
            designUrlToSend = await convertBlobToBase64(designData.overlay.url);

            // Si la convertion échoue, on arrête la commande
            if (!designUrlToSend) {
                alert("Erreur lors de la convertion de l'image");
                setLoading(false);
                return;
            }

                console.log("✅ Design converti en Base64, prêt pour envoi");
            } else {
                console.log("ℹ️ Le design est déjà en format permanent, pas de conversion nécessaire");
        }

        

        const OrderDTO = {
            number: orderNumber,
            price: designData.productData.price,
            quantity: 1,
            
            // Informations d'adresse
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,

            // Informations utilisateur
            email: user?.email, 
            phone: formData.phone,

            // Statut
            status: "EN_ATTENTE",

            // IDs pour les relations
            categoryId: designData.productData.category?.id,
            productId: designData.productData.id,
            userId: user?.id,
            
            // ✅ NOUVELLE STRUCTURE DESIGN DATA
            designData: {
                designUrl: designUrlToSend,
                positionX: designData.overlay.position?.x || 50,
                positionY: designData.overlay.position?.y || 50,
                scale: designData.overlay.scale || 1.0,
                productId: designData.productData.id
            },
            
            // ✅ DATES
            orderDate: formatDateForBackend(now),
            deliveryDate: formatDateForBackend(deliveryDate),
        };

        console.log("📦 DONNÉES ENVOYÉES AU BACKEND:", OrderDTO);

        try {
            const savedOrder = await createOrder(OrderDTO);
            console.log("✅ Commande créée :", savedOrder);
            
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

    useEffect(() => {
        const savedDesignData = localStorage.getItem("designData");
        const savedOrderData = localStorage.getItem("orderData");
        
        if (savedDesignData) {
            const parsedData = JSON.parse(savedDesignData);
            setDesignData(parsedData);
            console.log("🎨 Design data chargé:", parsedData);
        }
        
        if (savedOrderData) {
            const orderData = JSON.parse(savedOrderData);
            setFormData(orderData.formData);
            console.log("📝 Order data chargé:", orderData.formData);
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
                        {/* Aperçu du produit */}
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
                                    <span className="info-label">Utilisateur</span>
                                    <span className="info-value">{user?.email} (ID: {user?.id})</span>
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

                                {/* Informations techniques */}
                                <div className="info-item technical">
                                    <span className="info-label">ID Produit</span>
                                    <span className="info-value">{designData.productData.id}</span>
                                </div>
                                
                                <div className="info-item technical">
                                    <span className="info-label">ID Catégorie</span>
                                    <span className="info-value">{designData.productData.category?.id}</span>
                                </div>

                                {/* Design Info */}
                                <div className="info-item technical">
                                    <span className="info-label">Design Position</span>
                                    <span className="info-value">X: {designData.overlay.position?.x || 50}, Y: {designData.overlay.position?.y || 50}</span>
                                </div>
                                
                                <div className="info-item technical">
                                    <span className="info-label">Design Scale</span>
                                    <span className="info-value">{designData.overlay.scale || 1.0}</span>
                                </div>
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