// Appel à l'API de l'IA

import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const generateDesignByPrompt = async (prompt) => {
    try {
        const response = await axios.post(`${BASE_URL}/designs`, { prompt });
        return response.data; // un tableau d'URL images
    } catch (error) {
        console.error("Erreur IA :", error.message);
        throw error;
    }
};