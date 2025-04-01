import { useCallback, useEffect, useState } from "react";
import { getDNIData, getRUCData } from "../../../services/apisDocs";
import { toast } from "sonner";
import { authApi } from "../../../utils/apiAxios";
import { useFormContext } from "../../Form/useFormContext";

interface Denuncias {
	id: string;
	tracking_code: string;
	motivo_id: string;
	motivo: string;
	descripcion: string;
	fecha_registro: string;
	estado: string;
}

export const useSearchDenuncia = () => {
	const { motivos } = useFormContext();
	const [tipoDocumento, setTipoDocumento] = useState<string>("");
	const [numeroDocumento, setNumeroDocumento] = useState<string>("");
	const [nombre, setNombre] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [denunciaData, setDenunciaData] = useState<Denuncias[]>([]);
	const [error, setError] = useState<string | null>(null);

	const handleTipoDocumento = (tipo: string) => {
		setTipoDocumento(tipo);
		setNumeroDocumento("");
		setNombre("");
		setError(null);
	};
	const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const documentoValue = e.target.value;
		setNumeroDocumento(documentoValue);
	};

	const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		setNombre(nameValue);
	};
	useEffect(() => {
		if (tipoDocumento === "dni" && numeroDocumento.length !== 8) {
			setNombre("");
		}
		if (tipoDocumento === "dni" && numeroDocumento.length === 8 && nombre) {
			return;
		}
		if (tipoDocumento === "dni" && numeroDocumento.length === 8) {
			const fetchDniData = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const nombre = await getDNIData(numeroDocumento);
					if (nombre) {
						setNombre(nombre);
					} else {
						const errMsg =
							"No se pudo obtener la información del DNI";
						setError(errMsg);
						toast.error(errMsg);
					}
				} catch (err) {
					console.error("Error al consultar DNI:", err);
					const errMsg =
						"Error al consultar el DNI. Intente nuevamente.";
					setError(errMsg);
					toast.error(errMsg);
				} finally {
					setIsLoading(false);
				}
			};
			fetchDniData();
		}
	}, [tipoDocumento, numeroDocumento, nombre]);

	useEffect(() => {
		if (tipoDocumento === "ruc" && numeroDocumento.length !== 11) {
			setNombre("");
		}
		if (
			tipoDocumento === "ruc" &&
			numeroDocumento.length === 11 &&
			nombre
		) {
			return;
		}
		if (tipoDocumento === "ruc" && numeroDocumento.length === 11) {
			const fetchRucData = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const nombre = await getRUCData(numeroDocumento);
					if (nombre) {
						setNombre(nombre);
					} else {
						const errMsg =
							"No se pudo obtener la información del RUC";
						setError(errMsg);
						toast.error(errMsg);
					}
				} catch (err) {
					console.error("Error al consultar RUC:", err);
					const errMsg =
						"Error al consultar el RUC. Intente nuevamente.";
					setError(errMsg);
					toast.error(errMsg);
				} finally {
					setIsLoading(false);
				}
			};
			fetchRucData();
		}
	}, [tipoDocumento, numeroDocumento, nombre]);
	const fetchDenucias = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await authApi.get("/search", {
				params: {
					numero_documento: numeroDocumento,
				},
			});
			if (response.data && Array.isArray(response.data)) {
				const denunciasFormateadas = response.data.map(
					(denuncia: Denuncias) => ({
						id: denuncia.id,
						tracking_code: denuncia.tracking_code,
						motivo_id: denuncia.motivo_id,
						motivo:
							motivos.find(
								(motivo) => motivo.id === denuncia.motivo_id
							)?.nombre || "",
						descripcion: denuncia.descripcion,
						fecha_registro: denuncia.fecha_registro,
						estado: denuncia.estado,
					})
				);
				setDenunciaData(denunciasFormateadas);
				setError(null);
			} else {
				setDenunciaData([]);
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
			setIsLoading(false);
		}
	}, [numeroDocumento, motivos]);
	const handleSearchClick = useCallback(async () => {
		if (!tipoDocumento) {
			toast.error("Por favor, selecciona un tipo de documento.");
			return;
		}
		if (!numeroDocumento) {
			toast.error("Por favor, ingresa un número de documento válido.");
			return;
		}
		if (
			(tipoDocumento === "dni" && numeroDocumento.length !== 8) ||
			(tipoDocumento === "ruc" && numeroDocumento.length !== 11)
		) {
			toast.error(
				`El ${tipoDocumento.toUpperCase()} debe tener ${
					tipoDocumento === "dni" ? "8" : "11"
				} dígitos`
			);
			return;
		}
        await fetchDenucias();
	}, [tipoDocumento, numeroDocumento, fetchDenucias]);
	return {
		tipoDocumento,
		numeroDocumento,
		nombre,
		isLoading,
		denunciaData,
		error,
		handleTipoDocumento,
		handleDocumentoChange,
		handleName,
        handleSearchClick
	};
};
