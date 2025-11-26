import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../Services/Users/EnregisterAPI";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Styles/Users/RegisterStyle.css";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        role: "USER"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const InputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
        setError(""); // Reset error on change
    };

    const BackHome = () => navigate("/");

    const ApiRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { name, lastname, email, password } = formData;

        // Validations
        if (name.trim().length < 2 || name.trim().length > 30) {
            setError("Le prénom doit contenir entre 2 et 30 lettres");
            setLoading(false);
            return;
        }
        if (lastname.trim().length < 2 || lastname.trim().length > 30) {
            setError("Le nom de famille doit contenir entre 2 et 30 lettres");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Adresse email invalide !");
            setLoading(false);
            return;
        }
        if (password.trim().length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères");
            setLoading(false);
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                role: "USER"
            };

            console.log("📤 Données d'inscription:", dataToSend);
            const response = await registerUser(dataToSend);
            console.log("✅ Utilisateur enregistré", response);
            
            // Redirection avec message de succès
            navigate("/Login", { 
                state: { 
                    message: "🎉 Inscription réussie ! Connectez-vous maintenant." 
                } 
            });
        } catch (error) {
            console.log("❌ Erreur lors de l'enregistrement de l'utilisateur", error);
            setError(error.response?.data?.message || "Erreur lors de l'inscription. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="inscription-container">
                <div className="form-wrapper">
                    <h1 className="page_inscription">Inscription</h1>
                    
                    <form className="formulaire_inscription" onSubmit={ApiRegister}>
                        {error && (
                            <div className="error-message">
                                ❌ {error}
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="name">Prénom</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={formData.name}
                                onChange={InputChange}
                                required
                                placeholder="Votre prénom"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastname">Nom</label>
                            <input
                                type="text"
                                id="lastname"
                                className="form-control"
                                value={formData.lastname}
                                onChange={InputChange}
                                required
                                placeholder="Votre nom"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Adresse email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={formData.email}
                                onChange={InputChange}
                                required
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={formData.password}
                                onChange={InputChange}
                                required
                                placeholder="Minimum 8 caractères"
                            />
                        </div>

                        <div className="button_connexion">
                            <button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Inscription...
                                    </>
                                ) : (
                                    "✨ S'inscrire"
                                )}
                            </button>
                            
                            <button type="button" onClick={BackHome}>
                                ↩️ Retour
                            </button>
                        </div>

                        <div className="login-link">
                            Déjà un compte ? <a href="/Login" onClick={(e) => { e.preventDefault(); navigate("/Login"); }}>Se connecter</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;