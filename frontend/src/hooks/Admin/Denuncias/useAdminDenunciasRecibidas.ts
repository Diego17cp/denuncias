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
	const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
		{}
	);
	const [stateRows, setStateRows] = useState<Record<string, string>>({});
	const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>(
		{}
	);

	const handleEdit = (tracking_code: string) => {
		setEditingRows((prev) => ({
			...prev,
			[tracking_code]: !prev[tracking_code],
		}));
		if (!editingRows[tracking_code]) {
			const denuncia = denuncias.find(
				(d) => d.tracking_code === tracking_code
			);
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
	};
	const handleCommentChange = (tracking_code: string, value: string) => {
		setCommentInputs((prev) => ({
			...prev,
			[tracking_code]: value,
		}));
	};
	const handleStateChange = (tracking_code: string, value: string) => {
		setStateRows((prev) => ({
			...prev,
			[tracking_code]: value,
		}));
	};

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
		if (!user?.dni) {
			setError("No se pudo obtener el DNI del administrador");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const response = await authApi.get(`/recibida`, {
				params: {
					dni: user.dni,
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
	}, [user?.dni]);
	useEffect(() => {
		fetchDenunciasRecibidas();
	}, [fetchDenunciasRecibidas]);
	const toggleRowExpansion = (tracking_code: string) => {
		if (expandedRows[tracking_code]) {
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
	};
	const getStatusDescription = (estado: string) => {
		switch (estado) {
			case "pendiente":
				return "La denuncia está pendiente de revisión.";
			case "recibida":
				return "La denuncia ha sido recibida y está en proceso de análisis.";
			case "en proceso":
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
	};
	const submitUpdateDenuncia = useCallback(
		async (tracking_code: string) => {
			if (!user?.dni) {
				toast.error("No se pudo identificar al administrador");
				return;
			}
			if (!stateRows[tracking_code]) {
				toast.error("Debes seleccionar un estado para la denuncia");
				return;
			}
			try {
				setLoading(true);
				const response = await authApi.get("/updateDenuncia", {
					params: {
						tracking_code,
						dni_admin: user?.dni,
						comentario: commentInputs[tracking_code] || "",
						estado: stateRows[tracking_code],
					},
				});
				if (response.status === 200) {
					toast.success("Denuncia actualizada con éxito", {
						description:
							"La denuncia ha sido actualizada correctamente",
					});
					setDenuncias((prevDenuncias) =>
						prevDenuncias.map((denuncia) =>
							denuncia.tracking_code === tracking_code
								? {
									...denuncia,
									estado: stateRows[tracking_code],
									seguimiento_comentario:
										commentInputs[tracking_code] || "",
								}
								: denuncia
						)
					);
					setEditingRows((prev) => ({
						...prev,
						[tracking_code]: false,
					}));
					setExpandedRows((prev) => ({
						...prev,
						[tracking_code]: false,
					}));
				}
			} catch (error) {
				console.error("Error al actualizar la denuncia:", error);
				toast.error("Error al actualizar la denuncia", {
					description:
						"Ocurrió un error al intentar actualizar la denuncia",
				});
			} finally {
				setLoading(false);
			}
		},
		[user?.dni, stateRows, commentInputs, authApi]
	);
	const downloadAdjuntos = useCallback(
		async (tracking_code: string) => {
			if (!user?.dni) {
				toast.error("No se pudo identificar al administrador");
				return;
			}
			const toastId = toast.loading("Descargando archivos adjuntos...");

			try {
				setIsDownloading((prev) => ({
					...prev,
					[tracking_code]: true,
				}));
				const token = localStorage.getItem("token");
			
				const response = await fetch(
					`http://localhost/denuncias/backend/public/download?tracking_code=${tracking_code}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`Error HTTP: ${response.status}`);
				}
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					const jsonData = await response.json();
					toast.dismiss(toastId);
					toast.error(
						jsonData.message ||
						"No se encontraron archivos adjuntos"
					);
					return;
				}
				const blob = await response.blob();
				if (blob.size < 100) {
					toast.dismiss(toastId);
					toast.error(
						"El archivo descargado está vacío o es inválido"
					);
					return;
				}
				const downloadUrl = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = downloadUrl;
				link.setAttribute("download", `adjuntos_${tracking_code}.zip`);
				document.body.appendChild(link);
				link.click();
				link.remove();
				setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
				toast.dismiss(toastId);
				toast.success("Descarga iniciada correctamente");
			} catch (err: unknown) {
				console.error("Error al descargar archivos adjuntos:", error);
				toast.dismiss(toastId);
				if (err && typeof err === "object") {
					if ("response" in err) {
						const axiosError = err as {
							response: {
								status: number;
								data?: { message?: string };
							};
						};

						toast.error(
							`Error del servidor: ${axiosError.response.status}`,
							{
								description:
									axiosError.response.data?.message ||
									"Ocurrió un error al descargar los archivos",
							}
						);
					} else if (err instanceof Error) {
						// Error estándar de JavaScript
						toast.error("Error al descargar archivos", {
							description:
								err.message ||
								"No se pudo completar la descarga",
						});
					} else {
						// Otros tipos de error
						toast.error("Error al descargar archivos", {
							description:
								"Error desconocido durante la descarga",
						});
					}
				} else {
					toast.error("Error al descargar archivos", {
						description: "No se pudo completar la descarga",
					});
				}
			} finally {
				setIsDownloading((prev) => ({
					...prev,
					[tracking_code]: false,
				}));
			}
		},
		[user?.dni]
	);
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
		downloadAdjuntos,
		isDownloading,
	};
};
