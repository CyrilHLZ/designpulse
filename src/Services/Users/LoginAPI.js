import axios from "axios";

const LOGIN_API = "http://localhost:8080/api/users/login";

export const loginUser = async (Userdata) => {
    try {
        const response = await axios.post(LOGIN_API, Userdata, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log("L'utilisateur n'a pas pu être connecté", error.message ? error.message : error.message);
        throw error;
    }
};

