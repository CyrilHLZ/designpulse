import { useState } from "react";
import { generateDesignByPrompt } from "../../../Services/IA/IA_API";
import "../../../Styles/Shop/IA/AIImageSearchModal.css";

const AIImageSearchModal = ({ onClose, onSelectImage }) => {
    const [prompt, setPrompt] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [useModification, setUseModification] = useState(false);
    const [modificationParams, setmodificationParams] = useState({
        color: "",
        wings: "",
        style: "",
    });

    const handleSearch = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const results = await generateDesignByPrompt(prompt);
            setImages(results);
        } catch (error) {
            alert("Erreur lors de la génération des designs");
        }
        setLoading(false);
    };

    const handleModifyImage = async () => {
        setLoading(true);
        try {
            const modifiedPrompt = `${prompt}, couleur: ${modificationParams.color}, ailes: ${modificationParams.wings}, style: ${modificationParams.style}`;
            const results = await generateDesignByPrompt(prompt);
            setImages(results);
        } catch (error) {
            alert("Erreur lors de la modification de l'image")
        }
        setLoading(false);
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>✨ Générer un design avec l'IA</h2>

                <div className="prompt-section">
                    <input
                        type="text"
                        value={prompt}
                        placeholder="Ex: Dragon cosmique volant sur un nuage"
                        onChange={(e) => setPrompt(e.target.value)}
                        className="prompt-input"
                    />
                    <button onClick={handleSearch} className="btn-generate">Générer</button>
                    <button onClick={onClose} className="btn-end">Fermer</button>
                </div>

                {loading && <p className="loading-text">🌀 Chargement des images...</p>}

                <div className="generated-images-grid">
                    {images.map((imgUrl, index) => (
                        <img
                            key={index}
                            src={imgUrl}
                            alt="Design généré"
                            onClick={() => {
                                onSelectImage(imgUrl);
                                onClose();
                            }}
                            className="ai-design-thumbnail"
                        />
                    ))}
                </div>

                <div className="options-section">
                    <label>
                        <input
                            type="checkbox"
                            checked={useModification}
                            onChange={() => setUseModification(!useModification)}>
                        </input>
                        Je souhaite modifier le design
                    </label>
                </div>

                {useModification && (
                    <div className="modification-form">
                        <input
                            type="text"
                            placeholder="Couleur principale"
                            value={modificationParams.color}
                            onChange={(e) =>
                                setmodificationParams({ ...modificationParams, color: e.target.value })
                            }

                        />
                        <input
                            type="text"
                            placeholder="Style (ex: cartoon, réaliste)"
                            value={modificationParams.style}
                            onChange={(e) =>
                                setmodificationParams({ ...modificationParams, style: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Type d'ailes (ex: dragon, ange)"
                            value={modificationParams.wings}
                            onChange={(e) =>
                                setmodificationParams({ ...modificationParams, wings: e.target.value })
                            }
                        />
                        <button onClick={handleModifyImage} className="btn-modify">Modifier le design</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIImageSearchModal;
