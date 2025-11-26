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

    // Stocke les informations sur l'utilisateur connecté
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            return JSON.parse(userData);
        } else {
            return null;
        }
    })

    // Écoute les changements dans le localStorage (si on ouvre plusieurs onglets)
    useEffect(() => {
        const handleStorageChange = () => {
            const userData = localStorage.getItem("user");
            setUser(userData ? JSON.parse(userData) : null);
            setRole(getUserRole());
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


    const login = (user) => {
        console.log("🔐 Login avec:", user);

        // Si l'utilisateur n'a pas de rôle, on lui assigne "USER" par défaut
        const userWithRole = {
            ...user,
            role: user.role || "USER"
        };

        console.log("📝 Utilisateur avec rôle:", userWithRole);
        localStorage.setItem("user", JSON.stringify(userWithRole));
        setUser(userWithRole);
        setRole(userWithRole.role);
    };

    // Déconnexion : supprime le user et met role à null
    const logout = () => {
        console.log("🚪 Logout");
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ role, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};