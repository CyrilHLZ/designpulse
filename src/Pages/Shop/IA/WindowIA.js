// frontend/src/Pages/Shop/IA/WindowIA.jsx

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { PromptService } from "../../../Services/IA/PromptService";
import "../../../Styles/Shop/IA/WindowIA.css";

const WindowIA = ({ onClose, onSelectImage }) => {
  // ==================== ÉTATS ====================
  
  // Prompt utilisateur
  const [prompt, setPrompt] = useState("");
  
  // États de chargement et erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Images générées
  const [generatedImages, setGeneratedImages] = useState([]);
  const [numberOfImages, setNumberOfImages] = useState(6);
  
  // Paramètres de génération
  const [style, setStyle] = useState("modern");
  const [color, setColor] = useState("vibrant");
  const [composition, setComposition] = useState("centered");
  const [detailLevel, setDetailLevel] = useState("medium");
  const [artStyle, setArtStyle] = useState("vector");
  const [numberOfObjects, setNumberOfObjects] = useState("single");
  const [viewAngle, setViewAngle] = useState("front");
  const [backgroundType, setBackgroundType] = useState("white");
  
  // États pour l'analyse et modification
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [analyzedElements, setAnalyzedElements] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [elementModifications, setElementModifications] = useState({});

  // ==================== OPTIONS ====================
  const options = PromptService.getOptions();

  // ==================== GÉNÉRATION D'IMAGES ====================

  /**
   * 🎨 Génère plusieurs images selon le prompt et les paramètres
   */
  const handleGenerate = async () => {
    // Validation
    if (!prompt.trim()) {
      setError("Veuillez entrer une description");
      return;
    }

    // Reset
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedImageIndex(null);
    setAnalyzedElements(null);

    try {
      // Construction du prompt enrichi
      const finalPrompt = PromptService.buildEnrichedPrompt(prompt, {
        viewAngle,
        detailLevel,
        backgroundType,
        artStyle,
        numberOfObjects
      });

      console.log("📝 Prompt utilisateur :", prompt);
      console.log("🎨 Prompt final :", finalPrompt);

      // Génération parallèle de plusieurs images
      const imagePromises = Array.from({ length: numberOfImages }, () =>
        fetch("http://localhost:8080/api/ia/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: finalPrompt,
            style,
            color,
            composition,
          }),
        })
      );

      // Attente de toutes les réponses
      const responses = await Promise.all(imagePromises);
      const allData = await Promise.all(responses.map(r => r.json()));

      // Formatage des résultats
      const images = allData.map((data, index) => ({
        id: `${Date.now()}-${index}`,
        imageUrl: `http://localhost:8080${data.imageUrl || data.images?.[0]?.url}`,
        prompt: finalPrompt,
        parameters: { 
          style, 
          color, 
          composition, 
          detailLevel, 
          artStyle, 
          numberOfObjects,
          viewAngle,
          backgroundType
        }
      }));

      setGeneratedImages(images);
      console.log(`✅ ${images.length} images générées avec succès`);

    } catch (e) {
      console.error("❌ Erreur génération :", e);
      setError(`Erreur lors de la génération : ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== ANALYSE D'IMAGES ====================

  /**
   * 🔍 Analyse les éléments détectables dans le prompt
   */
  const analyzePromptElements = (userPrompt) => {
    const normalizedPrompt = userPrompt.toLowerCase();
    const detectedElements = [];
    
    // Base de données d'objets détectables
    const knownObjects = {
      "rose": { 
        name: "Rose", 
        colors: ["rouge", "rose", "blanc", "jaune", "orange", "violet"],
        styles: ["réaliste", "aquarelle", "abstrait", "minimaliste"]
      },
      "fleur": { 
        name: "Fleur", 
        colors: ["rouge", "rose", "blanc", "jaune", "violet", "bleu", "orange"],
        styles: ["réaliste", "aquarelle", "abstrait", "minimaliste"]
      },
      "dragon": { 
        name: "Dragon", 
        colors: ["rouge", "vert", "bleu", "noir", "doré", "argenté"],
        styles: ["fantastique", "réaliste", "cartoon", "tribal"]
      },
      "chat": { 
        name: "Chat", 
        colors: ["noir", "blanc", "gris", "roux", "tigré", "siamois"],
        styles: ["réaliste", "cartoon", "minimaliste", "kawaii"]
      },
      "lion": { 
        name: "Lion", 
        colors: ["doré", "brun", "fauve", "blanc"],
        styles: ["réaliste", "tribal", "géométrique", "majestueux"]
      },
      "tigre": { 
        name: "Tigre", 
        colors: ["orange", "noir", "blanc", "bleu"],
        styles: ["réaliste", "tribal", "abstrait", "féroce"]
      },
      "loup": {
        name: "Loup",
        colors: ["gris", "blanc", "noir", "brun"],
        styles: ["réaliste", "tribal", "mystique", "féroce"]
      },
      "crâne": {
        name: "Crâne",
        colors: ["blanc", "noir", "doré", "argenté"],
        styles: ["gothique", "tribal", "mexicain", "réaliste"]
      }
    };

    // Détection d'objet principal
    for (const [key, value] of Object.entries(knownObjects)) {
      if (normalizedPrompt.includes(key)) {
        detectedElements.push({
          name: value.name,
          currentColor: "original",
          colorSuggestions: value.colors,
          styleSuggestions: value.styles,
          description: `Élément principal détecté`
        });
        break;
      }
    }

    // Ajout de l'arrière-plan (toujours présent)
    detectedElements.push({
      name: "Fond",
      currentColor: "original",
      colorSuggestions: ["blanc", "noir", "transparent", "bleu ciel", "rose", "vert", "dégradé"],
      styleSuggestions: ["uni", "dégradé", "texture", "flou"],
      description: "L'arrière-plan de l'image"
    });

    // Si aucun objet détecté, ajouter un élément générique
    if (detectedElements.length === 1) {
      detectedElements.unshift({
        name: "Élément principal",
        currentColor: "original",
        colorSuggestions: ["rouge", "bleu", "vert", "jaune", "noir", "blanc", "violet"],
        styleSuggestions: ["réaliste", "abstrait", "minimaliste", "cartoon", "artistique"],
        description: "L'élément central de votre design"
      });
    }

    return { elements: detectedElements };
  };

  /**
   * 🧠 Lance l'analyse d'une image sélectionnée
   */
  const analyzeImageElements = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse (pourrait être remplacé par un appel backend)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const analyzed = analyzePromptElements(prompt);
      setAnalyzedElements(analyzed);
      
      // Initialiser les modifications
      const initialMods = {};
      analyzed.elements.forEach(el => {
        initialMods[el.name] = {
          color: el.currentColor,
          style: ""
        };
      });
      setElementModifications(initialMods);
      
      console.log("✅ Analyse terminée :", analyzed);
    } catch (e) {
      console.error("❌ Erreur d'analyse :", e);
      setError("Erreur lors de l'analyse de l'image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * 🖱️ Sélectionne une image et lance son analyse
   */
  const handleSelectImage = async (index) => {
    console.log(`🖼️ Image #${index + 1} sélectionnée`);
    setSelectedImageIndex(index);
    setAnalyzedElements(null);
    await analyzeImageElements();
  };

  /**
   * 🎨 Modifie un élément détecté (couleur ou style)
   */
  const handleModifyElement = (elementName, property, value) => {
    setElementModifications(prev => ({
      ...prev,
      [elementName]: {
        ...prev[elementName],
        [property]: value
      }
    }));
    console.log(`🎨 Modification : ${elementName} -> ${property} = ${value}`);
  };

  /**
   * 🔄 Régénère les images avec les modifications appliquées
   */
  const handleRegenerateWithModifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construire les modifications textuelles
      const modifications = Object.entries(elementModifications)
        .filter(([_, mod]) => (mod.color && mod.color !== "original") || mod.style)
        .map(([name, mod]) => {
          const parts = [];
          if (mod.color && mod.color !== "original") {
            parts.push(`${name} ${mod.color}`);
          }
          if (mod.style) {
            parts.push(`style ${mod.style} pour ${name}`);
          }
          return parts.join(", ");
        })
        .join("; ");

      // Prompt modifié
      const modifiedBasePrompt = modifications 
        ? `${prompt}, avec ${modifications}` 
        : prompt;

      // Reconstruction du prompt final
      const finalPrompt = PromptService.buildEnrichedPrompt(modifiedBasePrompt, {
        viewAngle,
        detailLevel,
        backgroundType,
        artStyle,
        numberOfObjects
      });

      console.log("🔄 Régénération avec :", finalPrompt);

      // Génération
      const imagePromises = Array.from({ length: numberOfImages }, () =>
        fetch("http://localhost:8080/api/ia/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: finalPrompt,
            style,
            color,
            composition,
          }),
        })
      );

      const responses = await Promise.all(imagePromises);
      const allData = await Promise.all(responses.map(r => r.json()));

      const images = allData.map((data, index) => ({
        id: `${Date.now()}-${index}`,
        imageUrl: `http://localhost:8080${data.imageUrl || data.images?.[0]?.url}`,
        prompt: finalPrompt,
        parameters: { style, color, composition, detailLevel, artStyle, numberOfObjects }
      }));

      setGeneratedImages(images);
      setSelectedImageIndex(null);
      setAnalyzedElements(null);
      
      console.log("✅ Régénération réussie");

    } catch (e) {
      console.error("❌ Erreur régénération :", e);
      setError(`Erreur lors de la régénération : ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RENDU ====================

  return createPortal(
    <div className="modal-overlay-ia">
      <div className="modal-backdrop-ia" onClick={onClose} />
      
      <div className="modal-content-ia-large">
        {/* ========== EN-TÊTE ========== */}
        <div className="modal-header-ia">
          <div>
            <h2>🎨 ATELIER IA INTELLIGENT</h2>
            <p>Créez des designs précis avec enrichissement automatique</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body-ia">
          {/* ========== SECTION GÉNÉRATION ========== */}
          <div className="generation-section">
            {/* Prompt */}
            <div className="prompt-container">
              <label>📝 Décrivez votre design</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Maomao des carnets de l'apothicaire, dragon vert, chat noir, rose rouge..."
                rows={3}
                className="prompt-textarea"
              />
              <p className="prompt-hint">
                💡 Soyez précis ! Ex: "Maomao", "dragon vert féroce", "rose rouge aquarelle"
              </p>
            </div>

            {/* Paramètres en grille */}
            <div className="detailed-params-grid">
              {/* Quantité d'objets */}
              <div className="param-group">
                <label>🔢 Quantité d'objets</label>
                <select 
                  value={numberOfObjects} 
                  onChange={(e) => setNumberOfObjects(e.target.value)}
                  className="param-select"
                >
                  {options.numberOfObjectsOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="param-hint">
                  {options.numberOfObjectsOptions.find(o => o.value === numberOfObjects)?.desc}
                </span>
              </div>

              {/* Style artistique */}
              <div className="param-group">
                <label>🎭 Style artistique</label>
                <select 
                  value={artStyle} 
                  onChange={(e) => setArtStyle(e.target.value)}
                  className="param-select"
                >
                  {options.artStyles.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span className="param-hint">
                  {options.artStyles.find(s => s.value === artStyle)?.desc}
                </span>
              </div>

              {/* Niveau de détail */}
              <div className="param-group">
                <label>✨ Niveau de détail</label>
                <select 
                  value={detailLevel} 
                  onChange={(e) => setDetailLevel(e.target.value)}
                  className="param-select"
                >
                  {options.detailLevels.map(d => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <span className="param-hint">
                  {options.detailLevels.find(d => d.value === detailLevel)?.desc}
                </span>
              </div>

              {/* Angle de vue */}
              <div className="param-group">
                <label>📐 Angle de vue</label>
                <select 
                  value={viewAngle} 
                  onChange={(e) => setViewAngle(e.target.value)}
                  className="param-select"
                >
                  {options.viewAngles.map(v => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type de fond */}
              <div className="param-group">
                <label>🖼️ Type de fond</label>
                <select 
                  value={backgroundType} 
                  onChange={(e) => setBackgroundType(e.target.value)}
                  className="param-select"
                >
                  {options.backgroundTypes.map(bg => (
                    <option key={bg.value} value={bg.value}>
                      {bg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Style général */}
              <div className="param-group">
                <label>🎨 Style général</label>
                <select 
                  value={style} 
                  onChange={(e) => setStyle(e.target.value)}
                  className="param-select"
                >
                  {options.styles.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Palette de couleurs */}
              <div className="param-group">
                <label>🌈 Palette de couleurs</label>
                <select 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="param-select"
                >
                  {options.colors.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Composition */}
              <div className="param-group">
                <label>📍 Composition</label>
                <select 
                  value={composition} 
                  onChange={(e) => setComposition(e.target.value)}
                  className="param-select"
                >
                  {options.compositions.map(comp => (
                    <option key={comp.value} value={comp.value}>
                      {comp.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contrôles de génération */}
            <div className="generation-controls">
              <div className="number-selector">
                <label>🖼️ Nombre d'images :</label>
                <select 
                  value={numberOfImages} 
                  onChange={(e) => setNumberOfImages(parseInt(e.target.value))}
                  className="number-select"
                >
                  <option value={4}>4 images</option>
                  <option value={6}>6 images</option>
                  <option value={8}>8 images</option>
                  <option value={10}>10 images</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`btn-generate-ia ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Génération en cours... ({numberOfImages} images)
                  </>
                ) : (
                  `🎨 Générer ${numberOfImages} designs`
                )}
              </button>
            </div>
          </div>

          {/* ========== MESSAGES D'ERREUR ========== */}
          {error && (
            <div className="error-message-ia">
              <span className="error-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* ========== GRILLE D'IMAGES GÉNÉRÉES ========== */}
          {generatedImages.length > 0 && (
            <div className="generated-images-section">
              <h3>✨ Designs générés ({generatedImages.length})</h3>
              <p className="info-text">
                Cliquez sur une image pour l'analyser et la modifier
              </p>
              
              <div className="images-grid-responsive">
                {generatedImages.map((img, index) => (
                  <div 
                    key={img.id} 
                    className={`image-card ${selectedImageIndex === index ? 'selected' : ''}`}
                    onClick={() => handleSelectImage(index)}
                  >
                    <div className="image-number">#{index + 1}</div>
                    <img
                      src={img.imageUrl}
                      alt={`Design ${index + 1}`}
                      className="generated-image"
                      loading="lazy"
                    />
                    {selectedImageIndex === index && (
                      <div className="selected-badge">✓ Sélectionné</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== ANALYSE ET MODIFICATION ========== */}
          {selectedImageIndex !== null && (
            <div className="intelligent-modification-section">
              <h3>🧠 Analyse de l'image #{selectedImageIndex + 1}</h3>

              <div className="analysis-layout">
                {/* Colonne gauche : Aperçu */}
                <div className="image-preview-column">
                  <img 
                    src={generatedImages[selectedImageIndex].imageUrl} 
                    alt="Image sélectionnée" 
                    className="preview-image-large"
                  />
                  
                  <button
                    onClick={() => {
                      onSelectImage(generatedImages[selectedImageIndex]);
                      onClose();
                    }}
                    className="btn-use-image"
                  >
                    ✅ Utiliser cette image
                  </button>
                </div>

                {/* Colonne droite : Contrôles */}
                <div className="modification-controls-column">
                  {isAnalyzing && (
                    <div className="analyzing-message">
                      <span className="spinner"></span>
                      <span>L'IA analyse les éléments de l'image...</span>
                    </div>
                  )}

                  {analyzedElements && (
                    <>
                      <h4>🎯 Éléments détectés</h4>
                      <p className="elements-info">
                        {analyzedElements.elements.length} élément(s) modifiable(s)
                      </p>

                      <div className="elements-list">
                        {analyzedElements.elements.map((element, idx) => (
                          <div key={idx} className="element-card">
                            <h5>{element.name}</h5>
                            <p className="element-description">{element.description}</p>

                            <div className="element-controls">
                              {/* Contrôle couleur */}
                              <div className="control-group">
                                <label>🎨 Couleur :</label>
                                <div className="color-options">
                                  <button
                                    className={`color-btn ${elementModifications[element.name]?.color === element.currentColor ? 'active' : ''}`}
                                    onClick={() => handleModifyElement(element.name, 'color', element.currentColor)}
                                  >
                                    Original
                                  </button>
                                  {element.colorSuggestions.map((color, i) => (
                                    <button
                                      key={i}
                                      className={`color-btn ${elementModifications[element.name]?.color === color ? 'active' : ''}`}
                                      onClick={() => handleModifyElement(element.name, 'color', color)}
                                    >
                                      {color}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Contrôle style */}
                              <div className="control-group">
                                <label>✨ Style :</label>
                                <select
                                  value={elementModifications[element.name]?.style || ""}
                                  onChange={(e) => handleModifyElement(element.name, 'style', e.target.value)}
                                  className="style-select"
                                >
                                  <option value="">Style original</option>
                                  {element.styleSuggestions.map((style, i) => (
                                    <option key={i} value={style}>
                                      {style}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleRegenerateWithModifications}
                        disabled={isLoading}
                        className="btn-regenerate-modified"
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner"></span>
                            Régénération...
                          </>
                        ) : (
                          `🔄 Régénérer avec les modifications`
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WindowIA;