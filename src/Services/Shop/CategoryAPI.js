import axios from "axios";

const BASE_URL = "http://localhost:8080/api/categories";

export const fetchCategories = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error("La catégorie n'a pas pu être récupérée :", error.message);
        throw error;
    }
};
