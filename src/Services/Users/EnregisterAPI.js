import axios from "axios";

const REGISTER_API = "http://localhost:8080/api/users/create";

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(REGISTER_API, userData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log("Erreur lors de la création de compte", error.message ? error.message : error.message);
        throw error;
    }
}