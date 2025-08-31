import { createContext, useEffect, useState } from "react";
import { getUserRole } from "./AuthUtils";

// Création d'un contexte global
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Stocke le rôle actuel dans un state (initialisé depuis localStorage)
    const [role, setRole] = useState(() => {
        const initialRole = getUserRole();
        console.log("🔍 Rôle initial:", initialRole);
        return initialRole;
    });

    // Écoute les changements dans le localStorage (si on ouvre plusieurs onglets)
    useEffect(() => {
        const handleStorageChange = () => {
            const newRole = getUserRole();
            console.log("🔄 Changement localStorage, nouveau rôle:", newRole);
            setRole(newRole);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Debug: surveille les changements de rôle
    useEffect(() => {
        console.log("✅ Rôle mis à jour:", role);
    }, [role]);

    // Connexion : enregistre le user dans localStorage et met à jour le state
    const login = (user) => {
        console.log("🔐 Login avec:", user);

        // Si l'utilisateur n'a pas de rôle, on lui assigne "USER" par défaut
        const userWithRole = {
            ...user,
            role: user.role || "USER"
        };

        console.log("📝 Utilisateur avec rôle:", userWithRole);
        localStorage.setItem("user", JSON.stringify(userWithRole));
        setRole(userWithRole.role);
    };

    // Déconnexion : supprime le user et met role à null
    const logout = () => {
        console.log("🚪 Logout");
        localStorage.removeItem("user");
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};