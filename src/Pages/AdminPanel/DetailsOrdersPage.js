import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "../../Services/AdminPanel/AdminPanelPageAPI";
import Navbar from "../../Components/Navbar";
import "../../Styles/AdminPanel/AdminPanelPage.css";

// Composant pour l'aperçu du design
const DesignOverlay = ({ productImage, designImage, position, scale }) => {
    return (
        <div className="design-preview" style={{ position: 'relative', display: 'inline-block' }}>
            <img 
                src={productImage} 
                alt="Produit" 
                style={{ maxWidth: '200px', height: 'auto' }}
            />
            {designImage && (
                <img 
                    src={designImage} 
                    alt="Design"
                    style={{
                        position: 'absolute',
                        left: position?.x || '50%',
                        top: position?.y || '50%',
                        transform: `translate(-50%, -50%) scale(${scale || 1})`,
                        maxWidth: '80%',
                        maxHeight: '80%',
                        pointerEvents: 'none'
                    }}
                />
            )}
        </div>
    );
};

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
                console.log("Données complètes de la commande:", orderData);
                
                setOrder(orderData);
                
                // Extraction des données existantes de la base de données
                setFormData({
                    // Informations de base de la commande
                    id: orderData.id,
                    number: orderData.number,
                    status: orderData.status || "EN_ATTENTE",
                    price: orderData.price,
                    quantity: orderData.quantity,
                    
                    // Informations utilisateur (extraites de la commande)
                    email: orderData.email,
                    phone: orderData.téléphone || orderData.phone,
                    address: orderData.adresse || orderData.address,
                    city: orderData.ville || orderData.city,
                    country: orderData.pays || orderData.country,
                    postalCode: orderData.postal_code || orderData.postalCode,
                    
                    // Dates
                    orderDate: orderData.date_de_commande,
                    orderTime: orderData.heure_de_commande,
                    deliveryDate: orderData.date_de_livraison,
                    deliveryTime: orderData.heure_de_livraison,
                    
                    // Produits et designs (structure telle que retournée par l'API)
                    products: orderData.products || orderData.items || []
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

    const handleProductChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((product, i) => 
                i === index ? { ...product, [field]: value } : product
            )
        }));
    };

    const handleDesignChange = (productIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((product, i) => 
                i === productIndex ? {
                    ...product,
                    designData: {
                        ...product.designData,
                        overlay: {
                            ...product.designData?.overlay,
                            [field]: value
                        }
                    }
                } : product
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateOrder(orderId, formData);
            setIsEditing(false);
            // Recharger les données
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

    if (loading) return <div className="text-center mt-5"><p>Chargement des détails de la commande...</p></div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
    if (!order) return <div className="text-center mt-5"><p>Commande non trouvée</p></div>;

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Détails de la commande #{formData.number}</h2>
                    <div>
                        <button 
                            className="btn btn-secondary me-2"
                            onClick={handleBack}
                        >
                            Retour
                        </button>
                        <button 
                            className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'}`}
                            onClick={() => setIsEditing(!isEditing)}
                        >
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
                                            <label htmlFor="email" className="form-label">Email :</label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={formData.email || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="phone" className="form-label">Téléphone :</label>
                                            <input 
                                                type="text" 
                                                name="phone" 
                                                value={formData.phone || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="address" className="form-label">Adresse :</label>
                                            <input 
                                                type="text" 
                                                name="address" 
                                                value={formData.address || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="postalCode" className="form-label">Code Postal :</label>
                                            <input 
                                                type="text" 
                                                name="postalCode" 
                                                value={formData.postalCode || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="city" className="form-label">Ville :</label>
                                            <input 
                                                type="text" 
                                                name="city" 
                                                value={formData.city || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="country" className="form-label">Pays :</label>
                                            <input 
                                                type="text" 
                                                name="country" 
                                                value={formData.country || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="status" className="form-label">Statut :</label>
                                            <select 
                                                name="status" 
                                                value={formData.status || ''} 
                                                onChange={handleInputChange}
                                                className="form-select"
                                                disabled={!isEditing}
                                            >
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
                                            <input 
                                                type="text" 
                                                name="price"
                                                value={formData.price || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Quantité totale :</label>
                                            <input 
                                                type="number" 
                                                name="quantity"
                                                value={formData.quantity || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date commande :</label>
                                            <input 
                                                type="text" 
                                                value={formData.orderDate ? `${formData.orderDate} ${formData.orderTime || ''}` : 'Non spécifiée'} 
                                                className="form-control"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date livraison :</label>
                                            <input 
                                                type="text" 
                                                value={formData.deliveryDate ? `${formData.deliveryDate} ${formData.deliveryTime || ''}` : 'Non spécifiée'} 
                                                className="form-control"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Produits avec Designs */}
                    <div className="card mb-4">
                        <div className="card-header bg-black text-white">
                            <h4>Produits de la commande</h4>
                        </div>
                        <div className="card-body">
                            {formData.products && formData.products.length > 0 ? (
                                formData.products.map((product, index) => (
                                    <div key={product.id || index} className="product-item mb-4 p-3 border rounded">
                                        <div className="row">
                                            {/* Aperçu du design */}
                                            <div className="col-md-4 text-center">
                                                <h6>Aperçu du produit personnalisé</h6>
                                                <DesignOverlay
                                                    productImage={product.imageUrl || `http://localhost:8080/upload/${product.image}`}
                                                    designImage={product.designData?.overlay?.url}
                                                    position={product.designData?.overlay?.position}
                                                    scale={product.designData?.overlay?.scale}
                                                />
                                            </div>
                                            
                                            {/* Informations produit */}
                                            <div className="col-md-8">
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <label className="form-label">Nom du produit :</label>
                                                        <input 
                                                            type="text" 
                                                            value={product.name || ''} 
                                                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                            className="form-control"
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Prix :</label>
                                                        <input 
                                                            type="text" 
                                                            value={product.price || ''} 
                                                            onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                                            className="form-control"
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Quantité :</label>
                                                        <input 
                                                            type="number" 
                                                            value={product.quantity || 1} 
                                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                                            className="form-control"
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label">Description :</label>
                                                        <textarea 
                                                            value={product.description || ''} 
                                                            onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                                                            className="form-control"
                                                            rows="2"
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                    
                                                    {/* Paramètres du design */}
                                                    {product.designData && (
                                                        <div className="col-12 mt-3 p-3 bg-light rounded">
                                                            <h6>Paramètres du design</h6>
                                                            <div className="row g-2">
                                                                <div className="col-md-6">
                                                                    <label className="form-label">Position X :</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={product.designData.overlay?.position?.x || 0} 
                                                                        onChange={(e) => handleDesignChange(index, 'x', parseInt(e.target.value))}
                                                                        className="form-control"
                                                                        disabled={!isEditing}
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="form-label">Position Y :</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={product.designData.overlay?.position?.y || 0} 
                                                                        onChange={(e) => handleDesignChange(index, 'y', parseInt(e.target.value))}
                                                                        className="form-control"
                                                                        disabled={!isEditing}
                                                                    />
                                                                </div>
                                                                <div className="col-12">
                                                                    <label className="form-label">Échelle :</label>
                                                                    <input 
                                                                        type="number" 
                                                                        step="0.1"
                                                                        value={product.designData.overlay?.scale || 1} 
                                                                        onChange={(e) => handleDesignChange(index, 'scale', parseFloat(e.target.value))}
                                                                        className="form-control"
                                                                        disabled={!isEditing}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">Aucun produit dans cette commande</p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-success me-2">
                                Enregistrer les modifications
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default DetailsOrdersPage;