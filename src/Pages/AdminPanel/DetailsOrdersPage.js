import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "../../Services/AdminPanel/AdminPanelPageAPI";
import Navbar from "../../Components/Navbar";
import "../../Styles/AdminPanel/AdminPanelPage.css";

// Composant pour l'aperçu du design
const DesignOverlay = ({ imageUrl, design, position, scale, editable }) => {
    return (
        <div className="design-preview" style={{ position: 'relative', display: 'inline-block' }}>
            <img 
                src={imageUrl} 
                alt="Produit" 
                style={{ maxWidth: '100%', height: 'auto' }}
            />
            {design && (
                <img 
                    src={design} 
                    alt="Design"
                    style={{
                        position: 'absolute',
                        left: position?.x || '50%',
                        top: position?.y || '50%',
                        transform: `translate(-50%, -50%) scale(${scale || 1})`,
                        maxWidth: '80%',
                        maxHeight: '80%'
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
                const orderData = await getOrderById(orderId); // 👈 Juste orderId
                console.log("Données de la commande:", orderData); // 👈 DEBUG
                setOrder(orderData);
                
                setFormData({
                    // Informations utilisateur
                    surname: orderData.user?.surname || orderData.surname || "",
                    name: orderData.user?.name || orderData.name || "",
                    email: orderData.user?.email || orderData.email || "",
                    phone: orderData.phone || "",
                    address: orderData.address || "",
                    postalCode: orderData.postalCode || "",
                    city: orderData.city || "",
                    country: orderData.country || "",
                    status: orderData.status || "EN_ATTENTE",
                    
                    // Informations produits
                    products: orderData.products?.map(product => ({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        size: product.size,
                        price: product.price,
                        quantity: product.quantity,
                        category: product.category?.name || product.category,
                        image: product.image,
                        imageUrl: `http://localhost:8080/upload/${product.image}`,
                        // Données du design si disponibles
                        designData: product.designData || {
                            overlay: product.overlay || { url: "", position: {}, scale: 1 },
                            productData: product.productData || { imageUrl: "" }
                        }
                    })) || []
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

    const handleDesignChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((product, i) => 
                i === index ? { 
                    ...product, 
                    designData: {
                        ...product.designData,
                        [field]: value
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
        navigate(-1); // 👈 Retour simple
    };

    if (loading) return <div className="text-center mt-5"><p>Chargement des détails de la commande...</p></div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
    if (!order) return <div className="text-center mt-5"><p>Commande non trouvée</p></div>;

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Détails de la commande #{order.number}</h2>
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
                                    <h4>Informations Utilisateur</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="surname" className="form-label">Nom :</label>
                                            <input 
                                                type="text" 
                                                name="surname" 
                                                value={formData.surname || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="name" className="form-label">Prénom :</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name || ''} 
                                                onChange={handleInputChange}
                                                className="form-control"
                                                disabled={!isEditing}
                                            />
                                        </div>
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

                        {/* Produits avec Scrollbar */}
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header bg-black text-white">
                                    <h4>Produits de la commande</h4>
                                </div>
                                <div className="card-body products-scroll-container">
                                    {formData.products && formData.products.length > 0 ? (
                                        formData.products.map((product, index) => (
                                            <div key={product.id} className="product-item mb-3 p-3 border rounded">
                                                {/* Aperçu du design */}
                                                {product.designData && (
                                                    <div className="container-product-infos mb-3 text-center">
                                                        <DesignOverlay
                                                            imageUrl={product.designData.productData?.imageUrl || product.imageUrl}
                                                            design={product.designData.overlay?.url}
                                                            position={product.designData.overlay?.position}
                                                            scale={product.designData.overlay?.scale}
                                                            editable={false}
                                                        />
                                                    </div>
                                                )}
                                                
                                                <div className="row align-items-center">
                                                    <div className="col-md-3 text-center">
                                                        <img 
                                                            src={product.imageUrl || `http://localhost:8080/upload/${product.image}`} 
                                                            alt={product.name}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: "80px", objectFit: "cover" }}
                                                        />
                                                    </div>
                                                    <div className="col-md-9">
                                                        <div className="row g-2">
                                                            <div className="col-12">
                                                                <label className="form-label">Nom :</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={product.name || ''} 
                                                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                                    className="form-control form-control-sm"
                                                                    disabled={!isEditing}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label">Prix :</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={product.price || ''} 
                                                                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                                                    className="form-control form-control-sm"
                                                                    disabled={!isEditing}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label">Quantité :</label>
                                                                <input 
                                                                    type="number" 
                                                                    value={product.quantity || 1} 
                                                                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                                                    className="form-control form-control-sm"
                                                                    disabled={!isEditing}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label">Catégorie :</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={product.category || ''} 
                                                                    onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                                                                    className="form-control form-control-sm"
                                                                    disabled={!isEditing}
                                                                />
                                                            </div>
                                                            <div className="col-12">
                                                                <label className="form-label">Description :</label>
                                                                <textarea 
                                                                    value={product.description || ''} 
                                                                    onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                                                                    className="form-control form-control-sm"
                                                                    rows="2"
                                                                    disabled={!isEditing}
                                                                />
                                                            </div>
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
                        </div>
                    </div>

                    {isEditing && (
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-success me-2">
                                Enregistrer les modifications
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default DetailsOrdersPage;