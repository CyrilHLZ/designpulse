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
                            style={{ 
                                '--index': index,
                                animationDelay: `${index * 0.07}s`
                            }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
                <div className="right">
                    {rightText.split("").map((letter, index) => (
                        <span
                            key={index}
                            style={{ 
                                '--index': index,
                                animationDelay: `${index * 0.07 + 0.5}s`
                            }}
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
                fromAddress: email,
                toAddress: "destinataire@gmail.com",
                subject: "Nouveau message de contact",
                bodyText: message
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
        <div>
            <Navbar />

            {/* Section Accueil */}
            <section id="accueil" className="section section-white">
                <div className="content-wrapper">
                    <AnimationTitre leftText="Pulsion" rightText="Design" />
                    <p className="subtitle-hero">
                        Une idée qui donne envie de créer
                    </p>
                    
                    {/* Section valeurs */}
                    <div className="values-section">
                        <div className="value-card">
                            <div className="value-icon">🎨</div>
                            <h3>Créativité Illimitée</h3>
                            <p>Notre IA transforme vos inspirations en designs uniques et personnalisés, repoussant les limites de l'imagination.</p>
                        </div>
                        
                        <div className="value-card">
                            <div className="value-icon">⚡</div>
                            <h3>Innovation Technologique</h3>
                            <p>À la pointe de l'intelligence artificielle pour des créations toujours plus audacieuses et contemporaines.</p>
                        </div>
                        
                        <div className="value-card">
                            <div className="value-icon">✨</div>
                            <h3>Excellence Artistique</h3>
                            <p>Chaque design est perfectionné avec une attention méticuleuse aux détails et à l'esthétique.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Histoire */}
            <section id="histoire" className="section section-gray">
                <div className="content-wrapper">
                    <div className="bloc-story">
                        <h3 className="title-sub">L'Art de la Création Révolutionnée</h3>
                        <p>
                            Pulsion Design incarne la fusion parfaite entre la vision artistique et la puissance technologique. 
                            Notre plateforme transforme vos idées les plus audacieuses en designs d'exception, prêts à marquer 
                            le monde de la mode et au-delà.
                        </p>
                        <p>
                            Pour les créateurs visionnaires, les passionnés d'esthétique et ceux qui aspirent à se démarquer 
                            par l'originalité et l'élégance.
                        </p>
                        
                        <div className="stats-container">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Créations Uniques</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Satisfaction Clients</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1 Week</span>
                                <span className="stat-label">Délai Moyen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Contact */}
            <section id="contact" className="section section-white">
                <div className="content-wrapper">
                    <div className="bloc-contact">
                        <h2 className="title-contact">Donnez Vie à Vos Idées</h2>
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

                            <label htmlFor="message">Votre vision</label>
                            <textarea
                                id="message"
                                rows="4"
                                className="textarea-field"
                                placeholder="Décrivez votre projet, vos inspirations..."
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>

                            <button type="submit" className="submit-button">
                                ✨ Lancer mon projet
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;