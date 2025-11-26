import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import DesignOverlay from "../../Components/Design/DesignOverlay";
import "../../Styles/Shop/DetailsProductPage.css";
import "../../Styles/Shop/BuyProductPage.css";

const BuyProductPage = () => {
    const [designData, setDesignData] = useState(null);
    const [formData, setFormData] = useState({
        address: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const savedDesignData = localStorage.getItem("designData");
        if (savedDesignData) {
            setDesignData(JSON.parse(savedDesignData));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const postalCodeRegex = /^[0-9]{5}$/;
        if (!postalCodeRegex.test(formData.postalCode)) {
            alert("Le code postal doit contenir exactement 5 chiffres !");
            return;
        }

        const orderData = {
            productData: {
                imageUrl: designData.productData.imageUrl,
                name: designData.productData.name,
                price: designData.productData.price,
            },
            overlay: {
                design: designData.overlay.url,
                position: designData.overlay.position,
                scale: designData.overlay.scale,
            },

            formData: formData, // adresse, ville, etc.
        };

        localStorage.setItem("orderData", JSON.stringify(orderData));
        navigate("/OrderProductPage");
    };


    const handleBackToDetailsPage = () => {
        const productId = designData?.productData?.id;
        if (productId) {
            navigate(`/DetailsProductPage/${productId}`);
        } else {
            console.error("Aucun productId trouvé");
        }
    };

    return (
        <>
            <Navbar />
            <h2 className="gold-title" >Achat du produit</h2>

            {designData && (
                <div className="container-product-infos">
                    <DesignOverlay
                        imageUrl={designData.productData.imageUrl}
                        design={designData.overlay.url}
                        position={designData.overlay.position}
                        scale={designData.overlay.scale}
                        editable={false}
                    />

                    {/* 🛒 Formulaire d'achat */}
                    <div className="col-md-6 mb-5">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">
                                    Adresse :
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="postalCode" className="form-label">
                                    Code Postal :
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="city" className="form-label">
                                    Ville :
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="mb-3">
                                    <label htmlFor="country" className="form-label">
                                        Pays :
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        Numéro de Téléphone :
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="container_boutton">
                                <button type="submit" className="btn btn-success w-100 mb-2">
                                    Valider la commande
                                </button>
                                <button type="button" onClick={handleBackToDetailsPage} className="btn btn-danger w-100">
                                    Retour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default BuyProductPage;
