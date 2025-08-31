import axios from "axios";

const EMAIL_API = "http://localhost:8080/api/emails";

export const sendEmail = async (payload) => {
    try {
        const response = await axios.post(`${EMAIL_API}/send`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'envoi du mail :", error);
        throw error;
    }
};
