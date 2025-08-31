import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../Services/Users/EnregisterAPI";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        role: "USER" // Rôle par défaut lors de l'inscription
    });

    const navigate = useNavigate();

    const InputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    const BackHome = () => navigate("/");

    const ApiRegister = async (e) => {
        e.preventDefault();

        const { name, lastname, email, password } = formData;

        if (name.trim().length < 2 || name.trim().length > 30) {
            alert("Le prenom doit contenir entre 2 et 30 lettres")
            return;
        }
        if (lastname.trim().length < 2 || lastname.trim().length > 30) {
            alert("Le nom de famille doit contenir entre 2 et 30 lettres")
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Adresse Email est invalide !")
            return;
        }
        if (password.trim().length < 8) {
            alert("Le mots de passe doit contenir au moins 8 caractères")
            return;
        }

        try {
            // S'assurer que le rôle est inclus dans les données envoyées
            const dataToSend = {
                ...formData,
                role: "USER" // Force le rôle USER pour tous les nouveaux utilisateurs
            };

            console.log("📤 Données d'inscription:", dataToSend);
            const response = await registerUser(dataToSend);
            console.log("✅ Utilisateur enregistré", response);
            navigate("/Login");
        } catch (error) {
            console.log("❌ Erreur lors de l'enregistrement de l'utilisateur", error);
            alert("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: "200px" }}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow p-4">
                            <h2 className="text-center mb-4">Inscription</h2>
                            <form onSubmit={ApiRegister}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Prénom :</label>
                                    <input type="text" id="name" className="form-control" value={formData.name} onChange={InputChange} required placeholder="Prénom"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastname" className="form-label">Nom :</label>
                                    <input type="text" id="lastname" className="form-control" value={formData.lastname} onChange={InputChange} required placeholder="Nom" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">E-mail :</label>
                                    <input type="email" id="email" className="form-control" value={formData.email} onChange={InputChange} required placeholder="E-mail" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Mot de passe :</label>
                                    <input type="password" id="password" className="form-control" value={formData.password} onChange={InputChange} required placeholder="Mot de passe" />
                                </div>
                                <div className="d-flex justify-content-around">
                                    <button type="submit" className="btn btn-primary">Envoyer</button>
                                    <button type="button" className="btn btn-secondary" onClick={BackHome}>Retour</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;