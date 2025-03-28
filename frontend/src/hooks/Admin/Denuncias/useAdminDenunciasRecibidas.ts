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
		setExpandedRows((prev) => ({
			...prev,
			[tracking_code]: !prev[tracking_code],
		}));
	};
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
	};
};
