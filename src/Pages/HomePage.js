// src/pages/HomePage.jsx
import { useState } from "react";
import Navbar from "../Components/Navbar";
import { sendEmail } from "../Services/Email/EmailAPI";

import "../Styles/HomePage.css";
import "../Styles/Composents/Navbar.css";
import "../Styles/Composents/AnimationTitre.css";

const HomePage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const AnimationTitre = ({ leftText, rightText }) => {
        return (
            <div className="Animation-Title">
                <div className="left">
                    {leftText.split("").map((letter, index) => (
                        <span
                            key={index}
                            style={{ animationDelay: `${index * 0.1}s`, fontSize: "10rem" }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
                <div className="right">
                    {rightText.split("").map((letter, index) => (
                        <span
                            key={index}
                            style={{ animationDelay: `${index * 0.1}s`, fontSize: "10rem" }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const handleSubmitContact = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                fromAddress: email, // l'email de l'utilisateur
                toAddress: "destinataire@gmail.com", // ton adresse pro
                subject: "Nouveau message de contact",
                bodyText: message // le message saisi
            };

            await sendEmail(payload);

            alert("✅ Email envoyé avec succès !");
            setEmail("");
            setMessage("");
        } catch (error) {
            console.error("Erreur envoi email :", error);
            alert("❌ Erreur lors de l'envoi du mail.");
        }
    };


    return (
        <div style={{ backgroundColor: "bisque" }}>
            <Navbar />

            <section id="accueil" className="section section-white">
                <AnimationTitre leftText="Pulsion " rightText=" Design" />
            </section>

            <section id="histoire" className="section section-gray">
                <div className="bloc-story">
                    <h3 className="title-sub">Notre histoire</h3>
                    <p>
                        Une plateforme où la créativité rencontre la technologie. Imagine une idée,
                        notre IA la transforme en design prêt à être imprimé. Pour les passionnés de mode,
                        les créateurs et tous ceux qui veulent se démarquer.
                    </p>
                </div>
            </section>

            <section id="contact" className="section section-white">
                <div className="bloc-contact">
                    <h2 className="title-contact">Nous contacter</h2>
                    <form className="form-container" onSubmit={handleSubmitContact}>
                        <label htmlFor="email">Votre adresse email</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            placeholder="name@exemple.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            rows="4"
                            className="textarea-field"
                            placeholder="Votre message"
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>

                        <button type="submit" className="submit-button">Envoyer</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
