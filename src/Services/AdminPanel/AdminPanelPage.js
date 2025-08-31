import axios from "axios";

const BASE_URL = "http://localhost:8080/api";


export const createOrder = async (orderDTO) => {
    try {
        const response = await axios.post(`${BASE_URL}/orders/create`, orderDTO);
        return response.data;
    } catch (error) {
        console.error("La commande n'a pas pu être créée et envoyée au serveur", error);
        throw error;
    }
};

export const getAllOrders = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/orders`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récuperation des commandes", error.message);
        throw error;
    }
};

export const getOrdersByNumber = async (number) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/number/${number}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récuperation des commandes par numéro", error.message);
        throw error;
    }
};

export const getOrdersByUserId = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes via les utilasateurs", error.message);
        throw error;
    }
};

export const deleteOrderById = async (orderId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppresion", error.message);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/users`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la recuperation des utilisateurs", error.message);
        throw error;
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        await axios.put(`${BASE_URL}/api/users/${userId}/role`, { role });
    } catch (error) {
        console.error("Erreur lors de la modification du role de l'utilisateur", error.message);
        throw error;
    }
};
