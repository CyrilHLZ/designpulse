import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { loginUser } from "../../Services/Users/LoginAPI";
import "../../Styles/Users/LoginStyle.css";
import "../../Styles/Composents/Navbar.css";
import { AuthContext } from "../../Components/Users/AuthContext";

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Gestion du changement des champs du formulaire
    const InputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    // Bouton retour vers l'accueil
    const BackHome = () => {
        navigate("/");
    };

    // Appel API réel - UNE SEULE fonction de login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Appelle l'API avec email et password
            const response = await loginUser(formData);
            console.log("Utilisateur connecté", response);

            // Vérifiez la structure de la réponse
            console.log("Structure de la réponse:", response);

            // Stocke l'utilisateur dans le contexte global et localStorage
            login(response);
            console.log("Réponse API login brute:", response);

            // Redirige vers la boutique
            navigate("/shop");
        } catch (error) {
            console.error("Echec de la connexion", error.message || error);
            setError("Erreur de connexion. Vérifiez vos identifiants.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Connexion</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail :</label>
                            <input type="email" id="email" className="form-control"
                                   placeholder="E-mail" required value={formData.email} onChange={InputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mot de passe :</label>
                            <input type="password" id="password" className="form-control"
                                   placeholder="Password" required value={formData.password} onChange={InputChange}
                            />
                        </div>

                        <div className="d-flex justify-content-around">
                            <button type="submit" className="btn btn-primary">Connexion</button>
                            <button type="button" onClick={BackHome} className="btn btn-secondary">Retour</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;