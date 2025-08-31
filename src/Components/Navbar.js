import { Link, useNavigate } from "react-router-dom";
import "../Styles/Composents/Navbar.css";
import { useContext } from "react";
import { AuthContext } from "./Users/AuthContext";

const Navbar = () => {
    // On récupère le rôle et la fonction logout depuis le contexte global AuthContext
    const { role, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const isADMIN = role === "ADMIN";
    const isUSER = role === "USER";
    // Déconnexion : supprime le user du localStorage et du contexte puis redirige
    const handleLogout = () => {
        logout();
        navigate("/Login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <ul className="navbar-menu">
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/Shop">Boutique</Link></li>
                    {isADMIN && (
                        <li>
                            <Link to="/AdminPanel">Administrateur</Link>
                        </li>
                    )}
                    {(isADMIN || isUSER) ? (
                        <li>
                            <button onClick={handleLogout} className="nav-button">Déconnexion</button>
                        </li>
                    ) : (
                        <>
                            <li><Link to="/Login">Connexion</Link></li>
                            <li><Link to="/Register">Inscription</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
