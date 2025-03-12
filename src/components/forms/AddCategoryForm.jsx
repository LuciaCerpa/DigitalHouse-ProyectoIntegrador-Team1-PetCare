import { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/forms/formStyles.css";

const API_URL = import.meta.env.VITE_API_URL;

const AddCategoryForm = ({ onClose, onSubmit }) => {
	const [formData, setFormData] = useState({
		nombre: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		onSubmit(formData);
		if (!nombre.trim()) {
			setError("El nombre es requerido");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch(`${API_URL}/api/categorias`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ nombre }),
			});

			if (!response.ok) throw new Error("Error al crear la categoría");

			const newCategory = await response.json();
			onSubmit(newCategory);
			onClose();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="form-overlay">
			<div className="form-container">
				<h2>Agregar Nueva Categoría</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Nombre:</label>
						<input
							type="text"
							value={formData.nombre}
							onChange={(e) =>
								setFormData({
									...formData,
									nombre: e.target.value,
								})
							}
							required
						/>
					</div>
					<div className="form-buttons">
						<button type="submit">Guardar</button>
						<button type="button" onClick={onClose}>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
AddCategoryForm.propTypes = {
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default AddCategoryForm;

