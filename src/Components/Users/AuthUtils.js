// Récupère le rôle de l'utilisateur stocké dans localStorage
export const getUserRole = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
        return null; // Aucun utilisateur connecté
    }

    try {
        const user = JSON.parse(userData);
        return user.role || null; // Retourne le rôle ou null
    } catch (error) {
        console.error("Erreur parsing user", error);
        return null;
    }
};

// Récupère toutes les infos de l'utilisateur depuis localStorage
export const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("Erreur parsing user", error);
        return null;
    }
};
