// frontend/src/Services/Shop/PromptService.js

/**
 * 🎨 SERVICE POUR LA GESTION DES PROMPTS
 * Centralise toutes les options de personnalisation
 */

export const PromptService = {
  
  /**
   * Construction du prompt enrichi côté frontend
   * (ajoute les paramètres techniques : vue, fond, détails)
   */
  buildEnrichedPrompt: (basePrompt, parameters) => {
    let finalPrompt = basePrompt;

    // Vue/Angle
    const viewDescriptions = {
      "front": ", front view",
      "side": ", side view, profile",
      "top": ", top view, bird's eye view",
      "angle": ", 3/4 angle view",
      "close": ", close-up view, macro shot"
    };
    if (parameters.viewAngle) {
      finalPrompt += viewDescriptions[parameters.viewAngle] || "";
    }

    // Niveau de détail
    const detailDescriptions = {
      "simple": ", simple design, minimalist, clean",
      "medium": ", moderate detail, balanced",
      "detailed": ", highly detailed, intricate",
      "ultra": ", ultra detailed, hyper realistic, 8k quality"
    };
    if (parameters.detailLevel) {
      finalPrompt += detailDescriptions[parameters.detailLevel] || "";
    }

    // Type de fond
    const backgroundDescriptions = {
      "white": ", isolated on pure white background",
      "transparent": ", transparent background, no background",
      "black": ", on black background",
      "gradient": ", gradient background",
      "solid-color": ", solid color background",
      "textured": ", textured background"
    };
    if (parameters.backgroundType) {
      finalPrompt += backgroundDescriptions[parameters.backgroundType] || "";
    }

    // Style artistique
    const artStyleDescriptions = {
      "vector": ", vector art, clean lines, flat design",
      "illustration": ", hand-drawn illustration, artistic",
      "photography": ", photographic style, realistic photo",
      "painting": ", painted artwork, brush strokes",
      "sketch": ", pencil sketch, hand-drawn lines",
      "digital": ", digital art, modern graphics"
    };
    if (parameters.artStyle) {
      finalPrompt += artStyleDescriptions[parameters.artStyle] || "";
    }

    // Nombre d'objets
    const objectCountDescriptions = {
      "single": "one single, just one",
      "few": "a few, 3 to 5",
      "many": "multiple, a bunch of",
      "crowd": "many, a lot of, crowded with"
    };
    if (parameters.numberOfObjects) {
      const prefix = objectCountDescriptions[parameters.numberOfObjects];
      finalPrompt = `${prefix} ${finalPrompt}`;
    }

    return finalPrompt;
  },

  /**
   * Options de configuration disponibles
   */
  getOptions: () => ({
    styles: [
      { value: "modern", label: "Moderne" },
      { value: "vintage", label: "Vintage" },
      { value: "minimalist", label: "Minimaliste" },
      { value: "graffiti", label: "Graffiti" },
      { value: "watercolor", label: "Aquarelle" },
      { value: "cartoon", label: "Cartoon" },
      { value: "realistic", label: "Réaliste" },
    ],

    colors: [
      { value: "vibrant", label: "Vibrant" },
      { value: "pastel", label: "Pastel" },
      { value: "monochrome", label: "Monochrome" },
      { value: "black-white", label: "Noir & Blanc" },
      { value: "warm", label: "Chaud" },
      { value: "cool", label: "Froid" },
      { value: "neon", label: "Néon" },
    ],

    compositions: [
      { value: "centered", label: "Centré" },
      { value: "top-left", label: "En haut à gauche" },
      { value: "top-right", label: "En haut à droite" },
      { value: "bottom-left", label: "En bas à gauche" },
      { value: "bottom-right", label: "En bas à droite" },
      { value: "pattern", label: "Motif répété" },
      { value: "diagonal", label: "Diagonal" },
    ],

    detailLevels: [
      { value: "simple", label: "Simple", desc: "Design épuré et minimaliste" },
      { value: "medium", label: "Moyen", desc: "Équilibre entre simplicité et détails" },
      { value: "detailed", label: "Détaillé", desc: "Beaucoup de détails et textures" },
      { value: "ultra", label: "Ultra-détaillé", desc: "Maximum de détails" },
    ],

    artStyles: [
      { value: "vector", label: "Vectoriel", desc: "Lignes nettes, idéal t-shirts" },
      { value: "illustration", label: "Illustration", desc: "Style dessiné à la main" },
      { value: "photography", label: "Photographique", desc: "Style photo réaliste" },
      { value: "painting", label: "Peinture", desc: "Style peinture artistique" },
      { value: "sketch", label: "Croquis", desc: "Style esquisse au crayon" },
      { value: "digital", label: "Art digital", desc: "Style numérique moderne" },
    ],

    numberOfObjectsOptions: [
      { value: "single", label: "Un seul objet", desc: "Ex: UNE rose" },
      { value: "few", label: "Quelques objets", desc: "Ex: 3-5 roses" },
      { value: "many", label: "Plusieurs objets", desc: "Ex: bouquet de roses" },
      { value: "crowd", label: "Beaucoup d'objets", desc: "Ex: champ de roses" },
    ],

    viewAngles: [
      { value: "front", label: "Vue de face" },
      { value: "side", label: "Vue de profil" },
      { value: "top", label: "Vue du dessus" },
      { value: "angle", label: "Vue en angle 3/4" },
      { value: "close", label: "Gros plan" },
    ],

    backgroundTypes: [
      { value: "white", label: "Fond blanc" },
      { value: "transparent", label: "Fond transparent" },
      { value: "black", label: "Fond noir" },
      { value: "gradient", label: "Dégradé" },
      { value: "solid-color", label: "Couleur unie" },
      { value: "textured", label: "Texturé" },
    ],
  })
};