import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Navbar from "../../Components/Navbar";
import DesignOverlay from "../../Components/Design/DesignOverlay";
import { ProductById, deleteDesign, SaveCapturedImage, getStockByProduct } from "../../Services/Shop/ProductAPI";
import { AuthContext } from "../../Components/Users/AuthContext";
import "../../Styles/Shop/DetailsProductPage.css";
import html2canvas from "html2canvas";

// Composant WindowIA intégré directement dans le fichier
const WindowIA = ({ onClose, onSelectImage }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState(null);
  const [style, setStyle] = useState("modern");
  const [color, setColor] = useState("vibrant");
  const [composition, setComposition] = useState("centered");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const styles = [
    { value: "modern", label: "Moderne" },
    { value: "vintage", label: "Vintage" },
    { value: "minimalist", label: "Minimaliste" },
    { value: "graffiti", label: "Graffiti" },
    { value: "watercolor", label: "Aquarelle" },
  ];

  const colors = [
    { value: "vibrant", label: "Vibrant" },
    { value: "pastel", label: "Pastel" },
    { value: "monochrome", label: "Monochrome" },
    { value: "black-white", label: "Noir & Blanc" },
    { value: "warm", label: "Chaud" },
    { value: "cool", label: "Froid" },
  ];

  const compositions = [
    { value: "centered", label: "Centré" },
    { value: "top-left", label: "En haut à gauche" },
    { value: "top-right", label: "En haut à droite" },
    { value: "bottom-left", label: "En bas à gauche" },
    { value: "bottom-right", label: "En bas à droite" },
    { value: "pattern", label: "Motif répété" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Veuillez entrer une description");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const response = await fetch("http://localhost:8080/api/ia/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          color,
          composition,
          brightness,
          contrast,
          saturation,
        }),
      });

      if (!response.ok) throw new Error("Erreur génération IA");

      const data = await response.json();
      const images = Array.isArray(data.images) 
        ? data.images.map((img, index) => ({
            id: data.id + "-" + index,
            imageUrl: `http://localhost:8080${img.url}`,
            prompt: data.prompt,
            parameters: { style, color, composition, brightness, contrast, saturation }
          }))
        : [{
            id: data.id,
            imageUrl: `http://localhost:8080${data.imageUrl}`,
            prompt: data.prompt,
            parameters: { style, color, composition, brightness, contrast, saturation }
          }];
      
      setGeneratedImages(images);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay-ia">
      <div className="modal-backdrop-ia" onClick={onClose} />
      
      <div className="modal-content-ia">
        <div className="modal-header-ia">
          <div>
            <h2>ATELIER IA</h2>
            <p>Créez et personnalisez vos designs</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body-ia">
          <div className="ia-controls-grid">
            {/* Colonne gauche: Prompt */}
            <div className="ia-prompt-section">
              <div className="form-group">
                <label>Décrivez votre design</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Un dragon stylisé, motif tribal, lettres gothiques..."
                  rows={4}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`btn-generate-ia ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Génération en cours...
                  </>
                ) : (
                  "🎨 Générer le design"
                )}
              </button>
            </div>

            {/* Colonne droite: Paramètres */}
            <div className="ia-params-section">
              <div className="params-grid">
                <div className="form-group">
                  <label>Style</label>
                  <select value={style} onChange={(e) => setStyle(e.target.value)}>
                    {styles.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Couleurs</label>
                  <select value={color} onChange={(e) => setColor(e.target.value)}>
                    {colors.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Composition</label>
                <select value={composition} onChange={(e) => setComposition(e.target.value)}>
                  {compositions.map((comp) => (
                    <option key={comp.value} value={comp.value}>{comp.label}</option>
                  ))}
                </select>
              </div>

              <div className="sliders-group">
                <div className="slider-item">
                  <label>Luminosité: <span>{brightness}%</span></label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                  />
                </div>

                <div className="slider-item">
                  <label>Contraste: <span>{contrast}%</span></label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                  />
                </div>

                <div className="slider-item">
                  <label>Saturation: <span>{saturation}%</span></label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="error-message-ia">
              ❌ {error}
            </div>
          )}

          {/* Designs générés */}
          {generatedImages.length > 0 && (
            <div className="generated-images-section">
              <h3>Designs générés ({generatedImages.length})</h3>
              
              <div className="images-grid">
                {generatedImages.map((img) => (
                  <div key={img.id} className="image-card">
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="generated-image"
                    />
                    
                    <div className="image-card-body">
                      <p className="image-prompt">"{img.prompt}"</p>
                      
                      <div className="image-actions">
                        <button
                          onClick={() => {
                            onSelectImage(img);
                            onClose();
                          }}
                          className="btn-select-design"
                        >
                          ✅ Sélectionner
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Composant principal
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

                                {/* Panneau de modification du design IA */}
                                {renderDesignModificationPanel()}

                                <div className="action-buttons-container">
                                    <div className="action-group">
                                        <label>Générer avec l'IA :</label>
                                        <button 
                                            type="button" 
                                            className="btn-ia-generate"
                                            onClick={() => setShowIAModal(true)}
                                        >
                                            🎨 Ouvrir l'atelier IA
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

                {/* Modal IA */}
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