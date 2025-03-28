import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LiaPawSolid } from "react-icons/lia";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const API_URL = `${BASE_URL}/api/usuarios`;

const AdminUserList = ({ onEdit }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const { auth, logout } = useContext(AuthContext);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        if (!auth || !auth.token) {
            logout();
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setUsers(response.data);
        } catch {
            setError("Error al cargar los usuarios");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [auth.token]);

    // Make fetchUsers available to parent
    useEffect(() => {
        if (window) {
            window.refreshCategoryList = fetchUsers;
        }
        return () => {
            if (window) {
                delete window.refreshCategoryList;
            }
        };
    }, []);

    // Make fetchUsers available globally
    useEffect(() => {
        window.refreshCategoryList = fetchUsers;
        return () => {
            delete window.refreshCategoryList;
        };
    }, [fetchUsers]); // Add fetchUsers as dependency

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setConfirmDelete(true);
    };

    const handleDeleteCancel = () => {
        setConfirmDelete(false);
        setUserToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        if (!userToDelete) return;
        setDeleteLoading(true);
        try {
            const response = await axios.delete(
                `${API_URL}/${userToDelete.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 204) {
                toast.success("Usuario eliminado exitosamente");
                setUsers(users.filter(u => u.id !== userToDelete.id));
                setError(null);
            }
        } catch (err) {
            const errorMessage = err.response?.status === 403
                ? "No tienes permisos para eliminar este usuario"
                : "Error al eliminar el usuario";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
            setConfirmDelete(false);
            setUserToDelete(null);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="admin-list">
                {error && <div className="error-message">{error}</div>}
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="table-header">Nombre</th>
                            <th className="table-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="table-row">
                                <td className="table-cell">{user.nombre}</td>
                                <td className="table-cell">
                                    <div className="action-buttons">
                                        <button
                                            className="icon-button"
                                            onClick={() => onEdit(user)}
                                            title="Editar"
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="icon-button delete"
                                            onClick={() => openDeleteModal(user)}
                                            title="Eliminar"
                                            disabled={deleteLoading}
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {confirmDelete && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <LiaPawSolid className="modal-icon" />
                        <p>
                            ¿Estás seguro de querer eliminar al usuario &quot;
                            {userToDelete?.nombre}&quot; del listado?
                        </p>
                        <div className="modal-buttons">
                            <button
                                className="modal-button cancel"
                                onClick={handleDeleteCancel}
                                disabled={deleteLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                className="modal-button confirm"
                                onClick={handleDeleteConfirmed}
                                disabled={deleteLoading}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

AdminUserList.propTypes = {
    onEdit: PropTypes.func.isRequired,
};

export default AdminUserList;
