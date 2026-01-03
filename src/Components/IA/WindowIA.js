import React, { useState } from "react";
import { createPortal } from "react-dom";
import "../../Styles/Composents/IA/IA.css";

const WindowIA = ({ onClose, onSelectImage, onSelectDesign = null }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState(null);
  
  // Nouveaux états pour les paramètres de modification
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
      
      // Si plusieurs images sont retournées
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

  const handleModifyImage = (imageId) => {
    const imageToModify = generatedImages.find(img => img.id === imageId);
    if (imageToModify && onSelectDesign) {
      onSelectDesign(imageToModify);
      onClose();
    }
  };

  const applyFilters = (imageUrl, filters) => {
    // Cette fonction appliquerait les filtres via une API ou Canvas
    // Pour l'instant, on retourne juste l'URL d'origine
    return imageUrl;
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      {/* Overlay sombre */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Fenêtre modale */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        {/* En-tête */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold tracking-wider">ATELIER IA</h2>
            <p className="text-gray-600 text-sm">Créez et personnalisez vos designs</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Prompt et paramètres */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche: Prompt */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Décrivez votre design
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Un dragon stylisé, motif tribal, lettres gothiques..."
                  rows={4}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Génération en cours...
                  </span>
                ) : (
                  "🎨 Générer le design"
                )}
              </button>
            </div>

            {/* Colonne droite: Paramètres */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    {styles.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Couleurs</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    {colors.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Composition</label>
                <select
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  {compositions.map((comp) => (
                    <option key={comp.value} value={comp.value}>
                      {comp.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sliders pour les ajustements */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Luminosité: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contraste: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Saturation: {saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              ❌ {error}
            </div>
          )}

          {/* Section 2: Designs générés */}
          {generatedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Designs générés ({generatedImages.length})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((img) => (
                  <div
                    key={img.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="p-3">
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        "{img.prompt}"
                      </p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectImage(img)}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition"
                        >
                          ✅ Sélectionner
                        </button>
                        
                        <button
                          onClick={() => handleModifyImage(img.id)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition"
                        >
                          ✏️ Modifier
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

export default WindowIA;