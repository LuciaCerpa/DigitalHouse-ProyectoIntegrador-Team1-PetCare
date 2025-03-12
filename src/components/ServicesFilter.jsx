import React, { useEffect, useState, useContext } from 'react'
import { FilterCategory } from './shared/FilterCategory'
import { ServicesFilterContainer, SelectContainer, SelectGroupContainer } from './styled-components/ServicesFilter.styles'
import { AuthContext } from "../auth/AuthContext";

export const ServicesFilter = () => {
    const [categories, setCategories] = useState([])
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)
    const [services, setServices] = useState([]);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if(auth){
            fetchServices();
        }
		  // Escuchar cambios de tamaño de pantalla
          const handleResize = () => {
            setIsMobile(window.innerWidth <= 767)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)

	}, []);

	const fetchServices = async () => {
		if (!auth.token || auth.role !== "ADMIN") {
			setError("No tienes permisos para acceder a esta información");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.get(
				`${API_URL}/api/servicios`,
				{
					headers: {
						Authorization: `Bearer ${auth?.token}`,
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Servicios desde la base de datos:");
			console.log(response?.data);
			console.log(response?.data?.listaServicios);
			setServices(response?.data?.listaServicios);
			setError(null);
		} catch (err) {
			const errorMessage =
				err.response?.status === 403
					? "No tienes permisos para acceder a esta información"
					: "Error al cargar los servicios";
			setError(errorMessage);
			console.error("Error fetching services:", err);
		} finally {
			setLoading(false);
		}
	};
      
    return (
        <div>
            <div>
                <p style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "5px"
                }}>Estoy buscando</p>

                {/* Renderiza select en móvil y lista en desktop */}
                {isMobile ? (
                    <SelectContainer>
                        <div>
                            <select>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </SelectContainer>
                ) : (
                    <ServicesFilterContainer>
                        {categories.map((category, index) => (
                            <FilterCategory key={index} name={category.name} icon={category.icon} id={index} />
                        ))}
                    </ServicesFilterContainer>
                )}
            </div>

            <SelectGroupContainer>
                <div className='firstSelect'>
                    <SelectContainer>
                        <p>Mi tipo de mascota</p>
                        <div>
                            <select>
                                <option value="gato">Gato</option>
                                <option value="perro">Perro</option>
                                <option value="pez">Pez</option>
                            </select>
                        </div>
                    </SelectContainer>
                </div>
                <div style={{ width: "100%" }}>
                    <SelectContainer>
                        <p>Ubicación</p>
                        <div>
                            <select>
                                <option value="medellin">Medellín, Antioquia, Colombia</option>
                                <option value="bogota">Bogotá, Colombia</option>
                                <option value="cali">Cali, Colombia</option>
                            </select>
                        </div>
                    </SelectContainer>
                </div>
            </SelectGroupContainer>
        </div >
    )
}
