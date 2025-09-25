import { useState, useEffect, useCallback } from "react";
import { authApi } from "../../../utils/apiAxios";
import { toast } from "sonner";
import { useAuthContext } from "../useAuthContext";
import { usePagination } from "../../usePagination";
interface Denuncia {
	tracking_code: string;
	fecha_registro: string;
	estado: string;
	denunciante_nombre: string;
	denunciante_dni: string;
	denunciado_nombre: string;
	motivo: string;
}

export const useAdminDenuncias = (itemsPerPage: number = 10) => {
	const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const fetchDenuncias = useCallback(async () => {
		try {
			setLoading(true);
			const response = await authApi.get("/denuncias");

			const denunciasFormateadas: Denuncia[] = response.data.map(
				(denuncia: Denuncia) => ({
					tracking_code: denuncia.tracking_code,
					fecha_registro: denuncia.fecha_registro,
					estado: denuncia.estado,
					denunciante_nombre: denuncia.denunciante_nombre,
					denunciante_dni: denuncia.denunciante_dni,
					denunciado_nombre: denuncia.denunciado_nombre,
					motivo: denuncia.motivo,
				})
			);
			setDenuncias(denunciasFormateadas);
			setError(null);
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
	}, []);

	useEffect(() => {
		fetchDenuncias();
	}, [fetchDenuncias]);

	const recibirDenuncia = async (dni: string, tracking_code: string) => {
		const adminDni = dni || user?.dni || "";
		if (!adminDni) {
			toast.error("Error de autenticación", {
				description: "No se pudo identificar al administrador actual"
			});
			return;
		}
		try {
			setIsLoading(true);
			await authApi.get(`/mandar`, {
				params: {
					dni_admin: adminDni,
					tracking_code: tracking_code
				}
			});
			setDenuncias((prev) =>
				prev.filter(
					(denuncia) => denuncia.tracking_code !== tracking_code
				)
			);
			toast.success("Denuncia recibida correctamente");
		} catch (error) {
			console.error("Error al recibir la denuncia:", error);
			toast.error("Error al recibir la denuncia", {
				description:
					"Ocurrió un error al recibir la denuncia, por favor intenta de nuevo",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const {
		currentPage,
		totalPages,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers,
		paginatedItems: denunciasPaginadas,
	} = usePagination(denuncias, itemsPerPage);



	return {
		denuncias,
		loading,
		error,
		totalPages,
		currentPage,
		denunciasPaginadas,
		handleCurrentPage,
		handlePageChange,
		getVisiblePageNumbers,
		recibirDenuncia,
		isLoading
	};
};
