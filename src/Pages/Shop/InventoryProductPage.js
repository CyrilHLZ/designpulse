import Navbar from "../../Components/Navbar";
import { useEffect, useState } from "react";
import { AllProducts, ProductByName, updateMultipleQuantities, getStockByProduct } from "../../Services/Shop/ProductAPI";

const InventoryProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({ productName: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productStocks, setProductStocks] = useState({});
    const [updates, setUpdates] = useState({});

    useEffect(() => {
        fetchAllProduct();
    }, []);

    const fetchAllProduct = async () => {
    try {
        setLoading(true);
        
        setProducts([]);
        setProductStocks({});
        setUpdates({}); 
        
        const data = await AllProducts();
        console.log("📋 Produits chargés:", data.map(p => ({ id: p.id, name: p.name })));
        setProducts(data);
        
        // Charger les stocks...
        const stockPromises = data.map(async (product) => {
            try {
                const productStockList = await getStockByProduct(product.id);
                
                const stockMap = {};
                if (Array.isArray(productStockList)) {
                    productStockList.forEach(item => {
                        if (item.size && item.quantity !== undefined) {
                            stockMap[item.size] = item.quantity;
                        }
                    });
                }
                return { productId: product.id, stocks: stockMap };
            } catch (err) {
                console.error(`Erreur stock produit ${product.id}`, err);
                return { productId: product.id, stocks: {} };
            }
        });

        const results = await Promise.all(stockPromises);

        const finalProductStocks = {};
        results.forEach(item => {
            if (item && item.productId) {
                finalProductStocks[item.productId] = item.stocks;
            }
        });

        setProductStocks(finalProductStocks);

        } catch (err) {
            console.error(err);
            setError("Erreur de chargement des produits");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const name = filters.productName.trim();

            if (!name) {
                await fetchAllProduct();
                return;
            }

            const result = await ProductByName(name);
            setProducts(result);

        } catch {
            setError("Aucun produit trouvé");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleQuantityChange = (productId, size, value) => {
        const quantity = Math.max(0, parseInt(value) || 0);
        
        setUpdates(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [size]: quantity
            }
        }));
    };

    const saveProduct = async (productId) => {
        try {
            const productUpdates = updates[productId];
            if (!productUpdates) {
                alert("Aucune modification pour ce produit");
                return;
            }

            // Créer les DTOs pour les mises à jour
            const stockDTOs = [];
            Object.entries(productUpdates).forEach(([size, quantity]) => {
                if (quantity > 0) {
                    stockDTOs.push({
                        productId: productId,
                        size: size,
                        quantity: quantity,
                        minimumQuantity: 0
                    });
                }
            });

            if (stockDTOs.length === 0) {
                alert("Aucune quantité positive à ajouter");
                return;
            }

            await updateMultipleQuantities(stockDTOs);
            alert(`${stockDTOs.length} taille(s) mise(s) à jour avec succès!`);
            
            // Recharger les stocks
            await fetchAllProduct();

        } catch (error) {
            console.error("Erreur lors de la mise à jour", error);
            alert("Erreur lors de la mise à jour");
        }
    };

    const saveAllProducts = async () => {
        try {
            const allUpdates = [];
            
            Object.entries(updates).forEach(([productId, sizes]) => {
                Object.entries(sizes).forEach(([size, quantity]) => {
                    if (quantity > 0) {
                        allUpdates.push({
                            productId: productId,
                            size: size,
                            quantity: quantity,
                            minimumQuantity: 0
                        });
                    }
                });
            });

            if (allUpdates.length === 0) {
                alert("Aucune modification à enregistrer");
                return;
            }

            console.log("📦 Données envoyées:", allUpdates); 

            await updateMultipleQuantities(allUpdates);
            alert(`${allUpdates.length} mise(s) à jour effectuée(s) avec succès!`);
            
            // Recharger les stocks
            await fetchAllProduct();

        } catch (error) {
            console.error("Erreur lors de la modification", error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    // Calculer le total des mises à jour pour un produit
    const getTotalUpdates = (productId) => {
        const productUpdates = updates[productId];
        if (!productUpdates) return 0;
        
        return Object.values(productUpdates).reduce((sum, qty) => sum + qty, 0);
    };

    // Obtenir toutes les tailles avec ou sans stock
    const getAllSizes = () => ["XS", "S", "M", "L", "XL"];

    return (
        <>
            <Navbar />
            <div className="container-fluid px-3 py-4">
                <h1 className="text-center mb-4">📦 Gestion des Stocks - Multi-Tailles</h1>

                {/* Barre de recherche */}
                <div className="card mb-4 p-3">
                    <div className="row g-2 align-items-center">
                        <div className="col-md-9">
                            <input
                                name="productName"
                                type="text"
                                className="form-control"
                                placeholder="🔍 Rechercher un produit..."
                                value={filters.productName}
                                onChange={handleInputChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary flex-grow-1" onClick={handleSearch}>
                                    Rechercher
                                </button>
                                <button className="btn btn-outline-secondary" onClick={fetchAllProduct}>
                                    ⟳
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <p className="mt-2">Chargement...</p>
                    </div>
                )}
                
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                    </div>
                )}

                {/* Tableau des produits */}
                {!loading && products.length > 0 && (
                    <div className="card">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0 fw-bold">Produits ({products.length})</h4>
                            <button 
                                type="button" 
                                className="btn btn-success btn-sm" 
                                onClick={saveAllProducts}
                                disabled={loading}
                            >
                                💾 Tout enregistrer
                            </button>
                        </div>
                        
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Produit</th>
                                            <th>Prix</th>
                                            <th>Catégorie</th>
                                            {getAllSizes().map(size => (
                                                <th key={size} className="text-center">
                                                    {size}<br/>
                                                    <small>Stock</small>
                                                </th>
                                            ))}
                                            {getAllSizes().map(size => (
                                                <th key={`add-${size}`} className="text-center bg-info bg-opacity-10">
                                                    +{size}<br/>
                                                    <small>Ajout</small>
                                                </th>
                                            ))}
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {products.map((product) => {
                                            const totalUpdates = getTotalUpdates(product.id);
                                            const hasUpdates = totalUpdates > 0;
                                            
                                            return (
                                                <tr key={product.id} className={hasUpdates ? "table-info" : ""}>
                                                    {/* ID */}
                                                    <td className="text-center">
                                                        <span className="badge bg-secondary">{product.id}</span>
                                                    </td>
                                                    
                                                    {/* Produit */}
                                                    <td>
                                                        <div className="fw-bold">{product.name}</div>
                                                        <small className="text-muted">{product.description}</small>
                                                    </td>
                                                    
                                                    {/* Prix */}
                                                    <td className="text-center fw-bold">
                                                        {product.price}€
                                                    </td>
                                                    
                                                    {/* Catégorie */}
                                                    <td className="text-center">
                                                        {product.category?.name || product.category_id}
                                                    </td>
                                                    
                                                    {/* Stocks actuels */}
                                                    {getAllSizes().map(size => {
                                                        const stock = productStocks[product.id]?.[size] || 0;
                                                        return (
                                                            <td key={`stock-${size}`} className="text-center">
                                                                <div className={stock === 0 ? "text-danger" : stock < 10 ? "text-warning" : "text-success"}>
                                                                    {stock}
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                    
                                                    {/* Quantités à ajouter */}
                                                    {getAllSizes().map(size => {
                                                        const currentStock = productStocks[product.id]?.[size] || 0;
                                                        const updateQty = updates[product.id]?.[size] || 0;
                                                        const newTotal = currentStock + updateQty;
                                                        
                                                        return (
                                                            <td key={`update-${size}`} className="text-center">
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    style={{ 
                                                                        width: "60px",
                                                                        margin: "0 auto",
                                                                        textAlign: "center"
                                                                    }}
                                                                    min="0"
                                                                    max="1000"
                                                                    value={updateQty}
                                                                    onChange={(e) => handleQuantityChange(product.id, size, e.target.value)}
                                                                    placeholder="0"
                                                                    title={`Stock: ${currentStock} → ${newTotal}`}
                                                                />
                                                            </td>
                                                        );
                                                    })}
                                                    
                                                    {/* Total */}
                                                    <td className="text-center">
                                                        <span className={`fw-bold ${hasUpdates ? "text-success" : "text-muted"}`}>
                                                            {totalUpdates}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Action */}
                                                    <td className="text-center">
                                                        <button
                                                            className={`btn btn-sm ${hasUpdates ? "btn-primary" : "btn-outline-secondary"}`}
                                                            onClick={() => saveProduct(product.id)}
                                                            disabled={!hasUpdates}
                                                        >
                                                            {hasUpdates ? `💾 ${totalUpdates}` : "💾"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                {!loading && products.length > 0 && (
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="alert alert-info">
                                <h6>🎯 Comment utiliser :</h6>
                                <ul className="mb-0">
                                    <li>Vous pouvez maintenant ajouter des quantités dans <strong>plusieurs tailles</strong> pour chaque produit</li>
                                    <li>Les quantités s'ajoutent aux stocks existants</li>
                                    <li>Cliquez sur <span className="badge bg-primary">💾 X</span> pour enregistrer un produit</li>
                                    <li>Ou sur <span className="badge bg-success">💾 Tout enregistrer</span> pour tous les produits</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="alert alert-warning text-center">
                        <h5 className="mb-0">📭 Aucun produit trouvé</h5>
                    </div>
                )}
            </div>
        </>
    );
};

export default InventoryProductPage;