import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../useAuthContext";
import { authApi } from "../../../utils/apiAxios";
import { toast } from "sonner";
import { DenunciaRecibida } from "../../../types";
import { usePagination } from "../../usePagination";

export const useAdminDenunciasRecibidas = (itemsPerPage: number = 10) => {
	const [denuncias, setDenuncias] = useState<DenunciaRecibida[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
		{}
	);
	const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
	const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
	const [stateRows, setStateRows] = useState<Record<string, string>>({});

	const handleEdit = (tracking_code: string) => {
		setEditingRows((prev) => ({
			...prev,
			[tracking_code]: !prev[tracking_code],
		}));
		if (!editingRows[tracking_code]) {
			const denuncia = denuncias.find(d => d.tracking_code === tracking_code);
			if (denuncia) {
				setCommentInputs((prev) => ({
					...prev,
					[tracking_code]: denuncia.seguimiento_comentario || "",
				}));
				setStateRows((prev) => ({
					...prev,
					[tracking_code]: denuncia.estado || "",
				}));
			}
		}
	}
	const handleCommentChange = (tracking_code: string, value: string) => {
		setCommentInputs((prev) => ({
			...prev,
			[tracking_code]: value,
		}));
	}
	const handleStateChange = (tracking_code: string, value: string) => {
		setStateRows((prev) => ({
			...prev,
			[tracking_code]: value,
		}));
	}

	const { user } = useAuthContext();
	const {
		paginatedItems: denunciasPaginadas,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers,
        currentPage,
        totalPages,
	} = usePagination(denuncias, itemsPerPage);

	const fetchDenunciasRecibidas = useCallback(async () => {
		if (!user?.dni_admin) {
			setError("No se pudo obtener el DNI del administrador");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const response = await authApi.get(`/recibida`, {
				params: {
					dni_admin: user.dni_admin,
				},
			});
			if (response.data && Array.isArray(response.data)) {
				const denunciasFormateadas: DenunciaRecibida[] =
					response.data.map((denuncia: DenunciaRecibida) => ({
						tracking_code: denuncia.tracking_code,
						estado: denuncia.estado,
						fecha_registro: denuncia.fecha_registro,
						denunciante_nombre: denuncia.denunciante_nombre,
						denunciante_dni: denuncia.denunciante_dni,
						denunciado_nombre: denuncia.denunciado_nombre,
						denunciado_dni: denuncia.denunciado_dni,
						motivo: denuncia.motivo,
						descripcion: denuncia.descripcion,
						fecha_incidente: denuncia.fecha_incidente,
						seguimiento_comentario: denuncia.seguimiento_comentario,
						motivo_otro: denuncia.motivo_otro,
					}));
				setDenuncias(denunciasFormateadas);
				setError(null);
			} else {
				setDenuncias([]);
			}
		} catch (error) {
			console.error("Error al obtener las denuncias:", error);
			if (error instanceof Error) {
				setError(
					error.message || "Ocurrió un error al obtener las denuncias"
				);
			} else {
				setError("Ocurrió un error al obtener las denuncias");
			}
			toast.error("Error al cargar las denuncias", {
				description:
					"No se pudieron cargar las denuncias, por favor intenta de nuevo",
			});
		} finally {
			setLoading(false);
		}
	}, [user?.dni_admin]);
	useEffect(() => {
		fetchDenunciasRecibidas();
	}, [fetchDenunciasRecibidas]);
	const toggleRowExpansion = (tracking_code: string) => {
		if(expandedRows[tracking_code]) {
			setEditingRows((prev) => ({
				...prev,
				[tracking_code]: false,
			}));
		}
		setExpandedRows((prev) => ({
			...prev,
			[tracking_code]: !prev[tracking_code],
		}));
	};
	const formatDate = (dateString: string) => {
		if (!dateString) return "Fecha no disponible";
	
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
	
		return new Date(dateString).toLocaleDateString("es-ES", options);
	}
	// Función para obtener descripciones de estados
	const getStatusDescription = (estado: string) => {
		switch (estado) {
			case "pendiente":
				return "La denuncia está pendiente de revisión.";
			case 'recibida':
				return "La denuncia ha sido recibida y está en proceso de análisis.";
			case "en_proceso":
				return "La denuncia está siendo analizada actualmente.";
			case "derivado":
				return "La denuncia ha sido derivada a otra unidad para su seguimiento.";
			case "resuelto":
				return "La denuncia ha sido resuelta satisfactoriamente.";
			case "rechazado":
				return "La denuncia ha sido rechazada debido a criterios específicos.";
			default:
				return "Estado actual de la denuncia.";
		}
	}
	const submitUpdateDenuncia = useCallback(async (tracking_code: string) => {
		if (!user?.dni_admin) {
			toast.error("No se pudo identificar al administrador");
			return;
		}
		if (!stateRows[tracking_code]) {
			toast.error("Debes seleccionar un estado para la denuncia");
			return;
		}
		try {
			setLoading(true);
			const response = await authApi.get('/updateDenuncia', {
				params: {
					tracking_code,
					dni_admin: user?.dni_admin,
					comentario: commentInputs[tracking_code] || "",
					estado: stateRows[tracking_code],
				}
			})
			if (response.status === 200) {
				toast.success("Denuncia actualizada con éxito", {
					description: "La denuncia ha sido actualizada correctamente",
				});
				setDenuncias(prevDenuncias => 
					prevDenuncias.map(denuncia => 
						denuncia.tracking_code === tracking_code
							? {
								...denuncia,
								estado: stateRows[tracking_code],
								seguimiento_comentario: commentInputs[tracking_code] || ""
							}
							: denuncia
					)
				);
				setEditingRows(prev => ({
					...prev,
					[tracking_code]: false
				}));
				setExpandedRows(prev => ({
					...prev,
					[tracking_code]: false
				}));
			}
		} catch (error) {
			console.error('Error al actualizar la denuncia:', error);
			toast.error("Error al actualizar la denuncia", {
				description: "Ocurrió un error al intentar actualizar la denuncia",
			})
		} finally {
			setLoading(false);
		}
	}, [user?.dni_admin, stateRows, commentInputs, authApi]);
	return {
		denuncias,
		denunciasPaginadas,
		loading,
		error,
		totalPages,
		currentPage,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers,
		toggleRowExpansion,
		expandedRows,
		formatDate,
		getStatusDescription,
		handleEdit,
		editingRows,
		handleCommentChange,
		commentInputs,
		handleStateChange,
		stateRows,
		submitUpdateDenuncia,
	};
};
