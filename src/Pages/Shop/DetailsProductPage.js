// src/Pages/Shop/DetailsProductPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import DesignOverlay from "../../Components/Design/DesignOverlay";
import { ProductById, deleteDesign, SaveCapturedImage, getStockByProduct } from "../../Services/Shop/ProductAPI";
import { AuthContext } from "../../Components/Users/AuthContext";
import WindowIA from "./IA/WindowIA.js";
import "../../Styles/Shop/DetailsProductPage.css";
import html2canvas from "html2canvas";

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
    const [selectedDesignMetadata, setSelectedDesignMetadata] = useState(null);
    const [showIAModal, setShowIAModal] = useState(false);
    const [designModifications, setDesignModifications] = useState({
      brightness: 100,
      contrast: 100,
      saturation: 100,
    });

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
                <div className="stock-status out-of-stock">
                    🚫 Rupture de stock pour la taille {size}
                </div>
            );
        } else if (quantity < 5) {
            return (
                <div className="stock-status low-stock">
                    ⚠️ Vite ! Plus que {quantity} article(s) en taille {size} !
                </div>
            );
        } else {
            return (
                <div className="stock-status in-stock">
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
            setSelectedDesignMetadata(null);
        }
    };

    // 🤖 Sélection design IA
    const handleSelectAIDesign = (designObject) => {
        // WindowIA passe toujours un objet
        setDesign(designObject.imageUrl);
        setSelectedDesignMetadata(designObject);

        if (designObject.parameters) {
            setDesignModifications({
                brightness: designObject.parameters.brightness || 100,
                contrast: designObject.parameters.contrast || 100,
                saturation: designObject.parameters.saturation || 100,
            });
        }
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

    // 🎨 Appliquer les filtres au design
    const applyFiltersToDesign = () => {
        if (!designRef.current) return;
        
        const filter = `
          brightness(${designModifications.brightness}%) 
          contrast(${designModifications.contrast}%) 
          saturate(${designModifications.saturation}%)
        `;
        designRef.current.style.filter = filter;
    };

    // Appliquer les filtres quand les modifications changent
    useEffect(() => {
        if (selectedDesignMetadata) {
            applyFiltersToDesign();
        }
    }, [designModifications, selectedDesignMetadata]);

    // 📸 Sauvegarde design
    const handleSaveDesign = async () => {
        if (!containerRef.current) return;

        const size = formData.size;
        const quantity = stockData[size];
        
        if (quantity === 0) {
            alert(`Désolé, la taille ${size} est en rupture de stock.`);
            return;
        }

        try {
            // Appliquer les filtres avant de capturer
            if (selectedDesignMetadata) {
                applyFiltersToDesign();
            }

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
                    filters: selectedDesignMetadata ? designModifications : null,
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

    // ❌ Suppression design
    const handleDeleteDesign = async () => {
        if (!selectedDesignMetadata?.id) {
            setDesign(null);
            setSelectedDesignMetadata(null);
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

    // 🎨 Panneau de modification du design IA
    const renderDesignModificationPanel = () => {
        if (!selectedDesignMetadata) return null;

        return (
            <div className="design-modification-panel">
                <h4>🛠️ Modifier le design IA</h4>
                
                <div className="modification-controls">
                    <div className="slider-control">
                        <label>
                            Luminosité: <span>{designModifications.brightness}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={designModifications.brightness}
                            onChange={(e) => setDesignModifications(prev => ({
                                ...prev,
                                brightness: parseInt(e.target.value)
                            }))}
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            Contraste: <span>{designModifications.contrast}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={designModifications.contrast}
                            onChange={(e) => setDesignModifications(prev => ({
                                ...prev,
                                contrast: parseInt(e.target.value)
                            }))}
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            Saturation: <span>{designModifications.saturation}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={designModifications.saturation}
                            onChange={(e) => setDesignModifications(prev => ({
                                ...prev,
                                saturation: parseInt(e.target.value)
                            }))}
                        />
                    </div>
                </div>
            </div>
        );
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
                    <p className="product-price"><strong>{formData.price} €</strong></p>

                    <form onSubmit={(e) => { e.preventDefault(); handleSaveDesign(); }}>
                        <div className="form-group">
                            <label>Choix de la taille :</label>
                            <select
                                id="select-size-clothes"
                                value={formData.size}
                                required
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            >
                                <option value="">-- Choisissez une taille --</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                            {renderStockStatus()}
                        </div>

                        <div className="form-group">
                            <label>Zoom du design : <span>{scale.toFixed(1)}x</span></label>
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
                                <div className="form-group">
                                    <label>Ajoutez votre design :</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageUpload} 
                                        className="file-input"
                                    />
                                </div>

                                {renderDesignModificationPanel()}

                                <div className="action-buttons-container">
                                    <div className="action-group">
                                        <label>Générer avec l'IA intelligente :</label>
                                        <button 
                                            type="button" 
                                            className="btn-ia-generate"
                                            onClick={() => setShowIAModal(true)}
                                        >
                                            🧠 Ouvrir l'atelier IA
                                        </button>
                                    </div>

                                    <div className="action-group">
                                        <label>Acheter le design :</label>
                                        <button type="submit" className="btn-buy">
                                            🛒 Acheter maintenant
                                        </button>
                                    </div>

                                    <div className="action-group">
                                        <label>Supprimer le design :</label>
                                        <button 
                                            type="button" 
                                            className="btn-delete"
                                            onClick={handleDeleteDesign}
                                        >
                                            🗑️ Supprimer le design
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                {/* Modal IA intelligent */}
                {showIAModal && (
                    <WindowIA
                        onClose={() => setShowIAModal(false)}
                        onSelectImage={handleSelectAIDesign}
                    />
                )}
            </div>
        </>
    );
};

export default DetailsProductPage;