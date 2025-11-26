import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import {getAllOrders, getAllUsers, getOrdersByNumber, getOrdersByUserId, deleteOrderById, updateUserRole} from "../../Services/AdminPanel/AdminPanelPageAPI";
import { useNavigate } from "react-router-dom";

const AdminPanelPage = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ number: "", userId: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [ordersData, usersData] = await Promise.all([
                getAllOrders(),
                getAllUsers(),
            ]);
            setOrders(ordersData);
            setUsers(usersData);
        } catch (err) {
            setError("Erreur de chargement des données");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            if (filters.number) {
                const result = await getOrdersByNumber(filters.number);
                setOrders(result);
            } else if (filters.userId) {
                const result = await getOrdersByUserId(filters.userId);
                setOrders(result);
            } else {
                await fetchAllData();
            }
        } catch (err) {
            setError("Erreur lors de la recherche");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteOrderById(orderId);
            fetchAllData();
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            fetchAllData();
        } catch (err) {
            alert("Erreur lors de la mise à jour du rôle");
        }
    };

    const handleDetailOrder = (orderId) => {
        navigate(`/DetailsOrdersPage/${orderId}`);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h1 className="text-center mb-4">Panneau d'administration</h1>

                <div className="card mb-4 p-3 shadow-sm">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-5">
                            <input name="number" type="text" className="form-control" placeholder="Numéro de commande" value={filters.number} onChange={handleInputChange}/>
                        </div>
                        <div className="col-md-5">
                            <input name="userId" type="text" className="form-control" placeholder="ID utilisateur" value={filters.userId} onChange={handleInputChange}/>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary w-100" onClick={handleSearch}>
                                Rechercher
                            </button>
                        </div>
                    </div>
                </div>

                {loading && <p className="text-center">Chargement...</p>}
                {error && <p className="alert alert-danger">{error}</p>}

                <h2 className="mt-5">Commandes</h2>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Numéro</th>
                            <th>Utilisateur</th>
                            <th>Action</th>
                            <th>Détails Commande</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.number}</td>
                                <td>{order.userId}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteOrder(order.id)}
                                    >
                                        Annuler
                                    </button>
                                </td>
                                <td>
                                <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleDetailOrder(order.id)}
                                >
                                    Détails de la commande
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="mt-5">Utilisateurs</h2>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Modifier le rôle</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        defaultValue={user.role}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminPanelPage;
