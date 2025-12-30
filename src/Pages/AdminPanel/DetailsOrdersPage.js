import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "../../Services/AdminPanel/AdminPanelPageAPI";
import Navbar from "../../Components/Navbar";
import DesignOverlay from "../../Components/Design/DesignOverlay";
import "../../Styles/AdminPanel/AdminPanelPage.css";

const DetailsOrdersPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const orderData = await getOrderById(orderId);
                console.log("🎯 DONNÉES COMPLÈTES DE LA COMMANDE:", orderData);
                
                setOrder(orderData);
                
                // Extraction des données
                setFormData({
                    // Informations de base
                    id: orderData.id,
                    number: orderData.number,
                    status: orderData.status || "EN_ATTENTE",
                    price: orderData.price,
                    quantity: orderData.quantity,
                    
                    // Informations utilisateur
                    email: orderData.email,
                    phone: orderData.téléphone || orderData.phone,
                    address: orderData.adresse || orderData.address,
                    city: orderData.ville || orderData.city,
                    country: orderData.pays || orderData.country,
                    postalCode: orderData.postal_code || orderData.postalCode,
                    
                    // ✅ DATES
                    orderDate: orderData.orderDate,
                    orderTime: orderData.orderTime,
                    deliveryDate: orderData.deliveryDate,
                    deliveryTime: orderData.deliveryTime,
                    
                    // ✅ DESIGN DATA
                    designData: orderData.designData || null
                });
                
            } catch (err) {
                setError("Erreur lors de la récupération des détails de la commande");
                console.error("Erreur détaillée:", err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateOrder(orderId, formData);
            setIsEditing(false);
            const updatedOrder = await getOrderById(orderId);
            setOrder(updatedOrder);
            alert("Commande mise à jour avec succès");
        } catch (err) {
            console.error("Erreur lors de la modification de la commande", err);
            setError("Erreur lors de la modification");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Fonction pour formater les dates
    const formatDate = (dateString, timeString) => {
        if (!dateString) return "Non spécifiée";
        
        try {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            if (timeString) {
                const cleanTime = timeString.split('.')[0];
                return `${formattedDate} à ${cleanTime}`;
            }
            
            return formattedDate;
        } catch (error) {
            return "Date invalide";
        }
    };

    if (loading) return <div className="text-center mt-5"><p>Chargement...</p></div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
    if (!order) return <div className="text-center mt-5"><p>Commande non trouvée</p></div>;

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Détails de la commande #{formData.number}</h2>
                    <div>
                        <button className="btn btn-secondary me-2" onClick={handleBack}>Retour</button>
                        <button className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'}`}
                            onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Annuler' : 'Modifier'}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Informations Utilisateur */}
                        <div className="col-md-6">
                            <div className="card mb-4">
                                <div className="card-header bg-black text-white">
                                    <h4>Informations Client</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Email :</label>
                                            <input type="email" name="email" value={formData.email || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Téléphone :</label>
                                            <input type="text" name="phone" value={formData.phone || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Adresse :</label>
                                            <input type="text" name="address" value={formData.address || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Code Postal :</label>
                                            <input type="text" name="postalCode" value={formData.postalCode || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Ville :</label>
                                            <input type="text" name="city" value={formData.city || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Pays :</label>
                                            <input type="text" name="country" value={formData.country || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Statut :</label>
                                            <select name="status" value={formData.status || ''} 
                                                onChange={handleInputChange} className="form-select" disabled={!isEditing}>
                                                <option value="EN_ATTENTE">En attente</option>
                                                <option value="CONFIRMEE">Confirmée</option>
                                                <option value="EXPEDIEE">Expédiée</option>
                                                <option value="LIVREE">Livrée</option>
                                                <option value="ANNULEE">Annulée</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations Commande */}
                        <div className="col-md-6">
                            <div className="card mb-4">
                                <div className="card-header bg-black text-white">
                                    <h4>Informations Commande</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Prix total :</label>
                                            <input type="text" name="price" value={formData.price || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Quantité :</label>
                                            <input type="number" name="quantity" value={formData.quantity || ''} 
                                                onChange={handleInputChange} className="form-control" disabled={!isEditing}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date commande :</label>
                                            <input type="text" value={formatDate(formData.orderDate, formData.orderTime)} 
                                                className="form-control" disabled/>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date livraison :</label>
                                            <input type="text" value={formatDate(formData.deliveryDate)} 
                                                className="form-control" disabled/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Design */}
                    <div className="card mb-4">
                        <div className="card-header bg-black text-white">
                            <h4>Produit Personnalisé</h4>
                        </div>
                        <div className="card-body">
                            {formData.designData ? (
                                <div className="row">
                                    {/* COLONNE GAUCHE : Aperçu du produit avec design */}
                                    <div className="col-md-6">
                                        <h5 className="text-center">Aperçu du design</h5>
                                        
                                        {/* ✅ Ajout d'un wrapper avec les styles nécessaires */}
                                        <div style={{ 
                                            display: "flex", 
                                            justifyContent: "center",
                                            alignItems: "flex-start"
                                        }}>
                                            <DesignOverlay
                                                imageUrl={
                                                    formData.designData.product?.image 
                                                        ? `http://localhost:8080/upload/${formData.designData.product.image}`
                                                        : "/default-product.jpg"
                                                }
                                                design={formData.designData.designUrl}
                                                position={{ 
                                                    x: formData.designData.positionX || 0, 
                                                    y: formData.designData.positionY || 0 
                                                }}
                                                scale={formData.designData.scale || 1.0}
                                                editable={false}
                                            />
                                        </div>
                                    </div>

                                    {/* ✅ COLONNE DROITE : Détails */}
                                    <div className="col-md-6">
                                        <h5>Détails du design</h5>
                                        <div className="product-details">
                                            
                                            {/* Informations produit */}
                                            {formData.designData.product && (
                                                <div className="mb-3 p-3" style={{backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                                                    <h6 className="mb-3">📦 Informations Produit</h6>
                                                    <p className="mb-2"><strong>Nom :</strong> {formData.designData.product.name}</p>
                                                    <p className="mb-2"><strong>Prix :</strong> {formData.designData.product.price} €</p>
                                                    <p className="mb-2"><strong>Catégorie :</strong> {formData.designData.product.category?.name}</p>
                                                    <p className="mb-0"><strong>Image :</strong> {formData.designData.product.image}</p>
                                                </div>
                                            )}
                                            
                                            {/* Type de design */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Type de design :</label>
                                                <div className="p-2 bg-light rounded">
                                                    {formData.designData.designUrl?.startsWith('data:image') 
                                                        ? '🎨 Image personnalisée (Base64)' 
                                                        : '🔗 Image externe (URL)'}
                                                </div>
                                            </div>
                                            
                                            {/* Position et échelle */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Paramètres de positionnement :</label>
                                                <div className="row g-2">
                                                    <div className="col-6">
                                                        <small className="text-muted">Position X</small>
                                                        <div className="p-2 bg-light rounded text-center">
                                                            {formData.designData.positionX || 0} px
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Position Y</small>
                                                        <div className="p-2 bg-light rounded text-center">
                                                            {formData.designData.positionY || 0} px
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <small className="text-muted">Échelle</small>
                                                        <div className="p-2 bg-light rounded text-center">
                                                            {formData.designData.scale || 1} × ({Math.round((formData.designData.scale || 1) * 100)}%)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Aperçu du design seul */}
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Aperçu du design seul :</label>
                                                <div 
                                                    className="border p-3 text-center" 
                                                    style={{
                                                        backgroundColor: '#ffffff', 
                                                        borderRadius: '8px',
                                                        minHeight: '200px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    {formData.designData.designUrl ? (
                                                        <img 
                                                            src={formData.designData.designUrl} 
                                                            alt="Design personnalisé" 
                                                            style={{
                                                                maxWidth: '100%', 
                                                                maxHeight: '250px',
                                                                objectFit: 'contain'
                                                            }}
                                                            onError={(e) => {
                                                                console.error("❌ Erreur chargement design");
                                                                e.target.parentElement.innerHTML = 
                                                                    '<p class="text-danger mb-0">❌ Erreur de chargement du design</p>';
                                                            }}
                                                            onLoad={() => {
                                                                console.log("✅ Design miniature chargé avec succès");
                                                            }}
                                                        />
                                                    ) : (
                                                        <p className="text-muted mb-0">Aucun design disponible</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-5">
                                    <p className="text-muted mb-0">
                                        <i className="bi bi-image" style={{fontSize: '3rem', display: 'block', marginBottom: '1rem'}}></i>
                                        Aucun design personnalisé pour cette commande
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-success me-2">Enregistrer</button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default DetailsOrdersPage;