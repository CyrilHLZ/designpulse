import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import DesignOverlay from "../../Components/Design/DesignOverlay";
import "../../Styles/Shop/DetailsProductPage.css";
import "../../Styles/Shop/OrderProductPage.css";
import {createOrder} from "../../Services/AdminPanel/AdminPanelPage";

const OrderProductPage = () => {
    const [designData, setDesignData] = useState(null);
    const [formData, setFormData] = useState({
        address: "",
        postalCode: "",
        city: "",
    });
    const [orderNumber, setOrderNumber] = useState("");

    const navigate = useNavigate();

    const handleConfirmOrder = async () => {
        if (!designData) return;

        const OrderDTO = {
            number: orderNumber,
            price: designData.productData.price,
            quantity: 1,
            image: formData.imageUrl,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            email: formData.email,
            phone: formData.phone,
            status: "EN_ATTENTE" || "VALIDE",
            productId: { id: designData.productData.id },
            userId: { id: designData.userId },
        };

        try {
            const savedOrder = await createOrder(OrderDTO);
            console.log("Commande créée :", savedOrder);
            alert(`Commande enregistrée ! : Numéro : $ ${savedOrder.number}`);
            navigate("/");
        } catch (error) {
            console.error("La commande n'a pas pu être enregistrée", error);
            throw error;
        }
    };

    const handleBack = () => {
        navigate("/");
    }

    // Générer un numéro de commande unique
    const generateOrderNumber = () => {
        // Option 1: Numéro simple 6-8 chiffres
        return Math.floor(Math.random() * 90000000) + 10000000;
    }

    // EXACTEMENT comme dans BuyProductPage
    useEffect(() => {
        const savedDesignData = localStorage.getItem("designData");
        if (savedDesignData) {
            setDesignData(JSON.parse(savedDesignData));
        }

        // Générer le numéro de commande une seule fois
        setOrderNumber(generateOrderNumber());
    }, []);

    // Récupérer les données de commande aussi
    useEffect(() => {
        const savedOrderData = localStorage.getItem("orderData");
        if (savedOrderData) {
            const orderData = JSON.parse(savedOrderData);
            setFormData(orderData.formData);
        }
    }, []);

    return (
        <>
            <Navbar />
            <h2 className="text-center mb-4">Récapitulatif de la commande</h2>

            {designData && (
                <div className="container-product-infos">
                    {/* ✅ EXACTEMENT copié depuis BuyProductPage */}
                    <DesignOverlay
                        imageUrl={designData.productData.imageUrl}
                        design={designData.overlay.url}
                        position={designData.overlay.position}
                        scale={designData.overlay.scale}
                        editable={false}
                    />

                    {/* 🛒 Infos de commande */}
                    <div className="col-md-6">
                        <h3>Informations de livraison</h3>
                        <p><strong>Numéro de la commande : </strong> {orderNumber}</p>
                        <p><strong>Nom du produit :</strong> {designData.productData.name}</p>
                        <p><strong>Prix :</strong> {designData.productData.price} €</p>
                        <p><strong>Adresse :</strong> {formData.address}</p>
                        <p><strong>Code Postal :</strong> {formData.postalCode}</p>
                        <p><strong>Ville :</strong> {formData.city}</p>

                        <button className="btn btn-success w-100 mt-4" onClick={handleConfirmOrder}>
                            Confirmer la commande
                        </button>

                        <button className="btn btn-primary w-100 mt-4" onClick={handleBack}>
                            Retour à la boutique
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderProductPage;