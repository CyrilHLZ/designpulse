import axios from "axios";

// URLs de base
const BASE_URL_PRODUCT = "http://localhost:8080/api/products";
const BASE_URL_DESIGN = "http://localhost:8080/api/design";
const BASE_URL_STOCK = "http://localhost:8080/api/stock";

// 1. Récupérer tous les produits
export const AllProducts = async () => {
    try {
        const response = await axios.get(BASE_URL_PRODUCT, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Les produits ne sont pas disponibles", error.message);
        throw error;
    }
};

// 2. Récupérer un produit par son nom
export const ProductByName = async (name) => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}/search?name=${name}`, {
            headers: {
                "Content-type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Le produit n'a pas pu être récupérer par son nom", error.message);
        throw error;
    }    
};


// 3. Récupérer un produit par son ID
export const ProductById = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}/${productId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Le produit n'est pas disponible", error.message);
        throw error;
    }
};

// 4. Mettre à jour un produit
export const updateProduct = async (productId, updatedData) => {
    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("description", updatedData.description);
    formData.append("price", updatedData.price);
    formData.append("quantity", updatedData.quantity);

    // Ajoute le fichier s'il est présent
    if (updatedData.image instanceof File) {
        formData.append("image", updatedData.image);
    }

    try {
        const response = await axios.put(`${BASE_URL_PRODUCT}/update/${productId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Le produit ne peut pas être mis à jour", error.message);
        throw error;
    }
};


// 5. Supprimer un produit
export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${BASE_URL_PRODUCT}/${productId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Le produit ne peut pas être supprimé", error.message);
        throw error;
    }
};

// 6. Acheter un produit
export const buyProduct = async (productId) => {
    try {
        const response = await axios.post(`${BASE_URL_PRODUCT}/buy/${productId}`, {}, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Le produit ne peut pas être acheté", error.message);
        throw error;
    }
};

// 7. Création d'un produit
export const createProduct = async (product) => {
    try {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("quantity", product.quantity);
        formData.append("categoryName", product.category); // le nom attendu par le backend
        formData.append("image", product.imageFile);// image en tant que fichier
        console.log("Données envoyées :", formData);

        const response = await axios.post(`${BASE_URL_PRODUCT}/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Le produit ne peut pas être créé :", error.message);
        throw error;
    }
};

// // 7. Achat du produit et sauvegarde du design
// export const SaveDesignProduct = async (designId, payload) => {
//     try {
//         const response = await axios.post(`${BASE_URL_DESIGN}/${designId}/saveImage`, payload, {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.log("Erreur lors de la sauvegarde du design", error.message);
//         throw error;
//     }
// }

// 8. Sauvegarde du design et du produit
export const SaveDesignProduct = async (productId, payload) => {
    try {
        const response = await axios.post(`${BASE_URL_DESIGN}/product/${productId}/saveImage`, {
            designImage: payload.previewImage,
            // Ajoutez d'autres champs si nécessaire
            productData: payload.productData,
            overlay: payload.overlay
        }, {
            params: {
                userId: 1 // Remplacez par l'ID utilisateur réel
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde du design", error.message);
        throw error;
    }
};

// 9. Sauvegarder une image en base64
export const SaveCapturedImage = async (productId, base64Image) => {
    try {
        // Option 1: Utiliser le nouvel endpoint avec productId
        const response = await axios.post(`${BASE_URL_DESIGN}/product/${productId}/saveImage`, {
            designImage: base64Image
        }, {
            params: {
                userId: 1 // Remplacez par l'ID utilisateur réel
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'image base64", error);

        // Log plus détaillé pour debug
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        }

        throw error;
    }
};

// 10. Suppression du design
export const deleteDesign = async (designId, userId = 1) => {
    try {
        const response = await axios.post(`${BASE_URL_DESIGN}/deleteDesign`, {
            // Corps de la requête si nécessaire
        }, {
            params: {
                userId: userId,
                designId: designId
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du design", error.message);
        throw error;
    }
};

// 12. Modification des quantités sur un produit (une taille)
export const updateQuantity = async (stockDTO) => {
    try {
        console.log("Envoi des données au backend:", stockDTO);
        
        const response = await axios.put(
            `${BASE_URL_STOCK}/updateQuantity`,
            stockDTO, 
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        
        console.log("Réponse du backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification du produit", error);
        
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        }
        
        throw error;
    }
};

// 13. Mettre à jour plusieurs stocks à la fois
export const updateMultipleQuantities = async (stockDTO) => {
    try {
        console.log("Envoi de plusieurs stocks au backend:", stockDTO);
        
        const response = await axios.put(
            `${BASE_URL_STOCK}/updateMultiple`,
            stockDTO, 
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        
        console.log("Réponse du backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification multiple", error);
        
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        }
        
        throw error;
    }
};

// Récupération des stocks sur un produit
export const getStockByProduct = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL_STOCK}/product/${productId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des stocks', error.message);
        throw error;
    }
}

// Récupérer les tailles disponibles pour un produit
export const getAvailableSizes = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL_STOCK}/product/${productId}/sizes`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des tailles', error.message);
        throw error;
    }
}

