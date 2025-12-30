import html2canvas from "html2canvas";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import AIImageSearchModal from "./IA/AIImageSearchModal";
import DesignOverlay from "../../Components/Design/DesignOverlay";
import { ProductById, deleteDesign, SaveCapturedImage, getStockByProduct } from "../../Services/Shop/ProductAPI";
import "../../Styles/Shop/DetailsProductPage.css";
import { AuthContext } from "../../Components/Users/AuthContext";

const DetailsProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const BASE_IMAGE_URL = "http://localhost:8080/upload";

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        size: "",
        imageUrl: "",
    });

    const [stockData, setStockData] = useState({});

    const { role } = useContext(AuthContext);
    const isADMIN = role === "ADMIN";
    const isUSER = role === "USER";

    const [design, setDesign] = useState(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 150, y: 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDesignMetadata, setSelectedDesignMetadata] = useState(null);

    const containerRef = useRef(null);
    const designRef = useRef(null);
    const productImageRef = useRef();

    // 🔄 Chargement du produit
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await ProductById(productId);
                const imageUrl = `${BASE_IMAGE_URL}/${data.image}`;
                setFormData({ ...data, imageUrl });
                
                // Charger les stocks
                const stocks = await getStockByProduct(productId);

                if (stocks && Array.isArray(stocks)) {
                    const stockMap = {};
                    stocks.forEach(item => {
                        stockMap[item.size] = item.quantity;
                    });
                    setStockData(stockMap);
                } else if (stocks && typeof stocks === 'object') {
                    setStockData(stocks);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération :", error.message);
            }
        };
        loadData();
    }, [productId]);

    // Fonction pour afficher le statut du stock
    const renderStockStatus = () => {
        const size = formData.size;

        if (!size) return null;

        const quantity = stockData[size];

        if (quantity === undefined) return null;

        if (quantity === 0) {
            return (
                <div style={{ color: "#dc3545", marginTop: "10px", fontWeight: "bold", fontSize: "0.95rem" }}>
                    🚫 Rupture de stock pour la taille {size}
                </div>
            );
        } else if (quantity < 5) {
            return (
                <div style={{ color: "#ff8c00", marginTop: "10px", fontWeight: "bold", fontSize: "0.95rem" }}>
                    ⚠️ Vite ! Plus que {quantity} article(s) en taille {size} !
                </div>
            );
        } else {
            return (
                <div style={{ color: "#198754", marginTop: "10px", fontWeight: "bold", fontSize: "0.95rem" }}>
                    ✅ En stock ({quantity} disponibles)
                </div>
            );
        }
    };

    // 📂 Import image utilisateur
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setDesign(imageURL);
        }
    };

    // 🤖 Sélection design IA
    const handleSelectAIDesign = (designObject) => {
        setDesign(designObject.imageUrl);
        setSelectedDesignMetadata(designObject);
    };

    // 🖱️ Drag
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - (designRef.current?.offsetWidth || 100) / 2;
        const y = e.clientY - rect.top - (designRef.current?.offsetHeight || 100) / 2;
        setPosition({ x, y });
    };
    const handleMouseUp = () => setIsDragging(false);

    // 📸 Sauvegarde design
    const handleSaveDesign = async () => {
        if (!containerRef.current) return;

        // Vérifier le stock avant de continuer
        const size = formData.size;
        const quantity = stockData[size];
        
        if (quantity === 0) {
            alert(`Désolé, la taille ${size} est en rupture de stock.`);
            return;
        }

        try {
            const canvas = await html2canvas(containerRef.current);
            const finalImage = canvas.toDataURL("image/png");

            const imageWidth = productImageRef.current?.offsetWidth || 0;
            const imageHeight = productImageRef.current?.offsetHeight || 0;

            const payload = {
                productId,
                previewImage: finalImage,
                productData: {
                    ...formData,
                    imageUrl: formData.imageUrl,
                    imageWidth,
                    imageHeight,
                },
                overlay: {
                    url: design,
                    position,
                    scale,
                },
                createdAt: new Date().toISOString(),
            };

            localStorage.setItem("designData", JSON.stringify(payload));

            await SaveCapturedImage(productId, finalImage);
            navigate(`/BuyProductPage/${productId}`);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            alert("Erreur lors de la sauvegarde du design");
        }
    };

    // ❌ Suppression design IA
    const handleDeleteDesign = async () => {
        if (!selectedDesignMetadata?.id) {
            alert("Aucun design sélectionné à supprimer");
            return;
        }

        try {
            await deleteDesign(selectedDesignMetadata.id, 1);
            setDesign(null);
            setSelectedDesignMetadata(null);
            alert("Design supprimé avec succès");
        } catch (error) {
            console.error("Erreur suppression :", error);
            alert("Erreur lors de la suppression du design");
        }
    };

    return (
        <>
            <Navbar />
            <div className="product-detail-container">
                <DesignOverlay
                    imageUrl={formData.imageUrl}
                    design={design}
                    position={position}
                    scale={scale}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    editable={true}
                    containerRef={containerRef}
                    designRef={designRef}
                    productImageRef={productImageRef}
                />

                <div className="product-info-section">
                    <h2>{formData.name}</h2>
                    <p>{formData.description}</p>
                    <p><strong>{formData.price} €</strong></p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveDesign();
                        }}
                    >
                        <div className="mb-3">
                            <label>Choix de la taille :</label>
                            <select
                                id="select-size-clothes"
                                value={formData.size}
                                required
                                onChange={(e) =>
                                    setFormData({ ...formData, size: e.target.value })
                                }
                            >
                                <option value="">-- Choisissez une taille --</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                            {/* Affichage du statut du stock */}
                            {renderStockStatus()}
                        </div>

                        <div className="mb-3">
                            <label>Zoom du design :</label>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.1"
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                            />
                        </div>

                        {(isADMIN || isUSER) && (
                            <>
                                <div className="mb-3">
                                    <label>Ajoutez votre design :</label>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                                </div>

                                <div className="container-boutton">
                                    <div className="mb-3">
                                        <label>Générer des designs par l'IA :</label>
                                        <button type="button" className="btn-ia-generate" onClick={() => setShowModal(true)}>
                                            🎨 Générer avec l'IA
                                        </button>
                                        {showModal && (
                                            <AIImageSearchModal
                                                onClose={() => setShowModal(false)}
                                                onSelectImage={handleSelectAIDesign}
                                            />
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label>Acheter le design :</label>
                                        <button type="submit" className="btn-buy">🛒 Acheter maintenant</button>
                                    </div>

                                    <div className="mb-3">
                                        <label>Supprimer le design :</label>
                                        <button type="button" className="btn-delete" onClick={handleDeleteDesign}>
                                            🗑️ Supprimer le design
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default DetailsProductPage;