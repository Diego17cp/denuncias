import { useCallback, useEffect, useState } from "react";
import { getDNIData, getRUCData } from "../../../services/apisDocs";
import { toast } from "sonner";
import { authApi } from "../../../utils/apiAxios";
import { useFormContext } from "../../Form/useFormContext";

export interface Denuncias {
	id: string;
	tracking_code: string;
	motivo_id: string;
	motivo: string;
	descripcion: string;
	fecha_registro: string;
	fecha_incidente: string
	estado: string;
	motivo_otro: string;
	denunciante_nombre: string
	denunciante_dni: string
	seguimiento_comentario: string
	denunciado_nombre: string
	denunciado_dni: string
}

export const useSearchDenuncia = () => {
	const { motivos } = useFormContext();
	const [tipoDocumento, setTipoDocumento] = useState<string>("");
	const [numeroDocumento, setNumeroDocumento] = useState<string>("");
	const [nombre, setNombre] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [denunciaData, setDenunciaData] = useState<Denuncias[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [hasSearched, setHasSearched] = useState<boolean>(false);
	const [isLoadingDNI, setIsLoadingDNI] = useState<boolean>(false);
	const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
		{}
	);
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [fechaFilter, setFechaFilter] = useState<string>("");
	const [motivoFilter, setMotivoFilter] = useState<string>("");
	const [estadoFilter, setEstadoFilter] = useState<Record<string, boolean>>({
		registrado: false,
		en_proceso: false,
		resuelto: false,
		rechazado: false,
		recibida: false
	});
	const [filtered, setFiltered] = useState<boolean>(false);
	const [denunciasFiltradasData, setDenunciasFiltradasData] = useState<
		Denuncias[]
	>([]);

	const toggleCardDetails = (id: string) => {
		setExpandedCards((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};
	const handleTipoDocumento = (tipo: string) => {
		setTipoDocumento(tipo);
		setNumeroDocumento("");
		setNombre("");
		setError(null);
		if (hasSearched) {
			setDenunciaData([]);
			setHasSearched(false);
		}
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
				setIsLoadingDNI(true);
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
					setIsLoadingDNI(false);
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
				setIsLoadingDNI(true);
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
					setIsLoadingDNI(false);
				}
			};
			fetchRucData();
		}
	}, [tipoDocumento, numeroDocumento, nombre]);
	const fetchDenucias = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await authApi.get("/search", {
				params: {
					numero_documento: numeroDocumento,
				},
			});
			if (
				response.data &&
				response.data.success &&
				Array.isArray(response.data.data)
			) {
				const denunciasFormateadas = response.data.data.map(
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
						fecha_incidente: denuncia.fecha_incidente,
						estado: denuncia.estado,
						motivo_otro: denuncia.motivo_otro,
						denunciante_nombre: denuncia.denunciante_nombre,
						denunciante_dni: denuncia.denunciante_dni,
						seguimiento_comentario: denuncia.seguimiento_comentario,
						denunciado_nombre: denuncia.denunciado_nombre,
						denunciado_dni: denuncia.denunciado_dni,
					})
				);
				setDenunciaData(denunciasFormateadas);
				if (denunciasFormateadas.length === 0) {
					toast.info(
						"No se encontraron denuncias para este documento"
					);
				} else {
					toast.success(
						`Se encontraron ${denunciasFormateadas.length} denuncias`
					);
				}
				setError(null);
			} else {
				setDenunciaData([]);
				toast.info("No se encontraron denuncias para este documento");
			}
		} catch (error) {
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
		setHasSearched(true);
		await fetchDenucias();
	}, [tipoDocumento, numeroDocumento, fetchDenucias]);
	const handleShowFilters = () => {
		setShowFilters((prev) => !prev);
	};
	const handleFechaFilterChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setFechaFilter(e.target.value);
	};
	const handleMotivoFIlterChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		setMotivoFilter(e.target.value);
	};
	const handleEstadoFilterChange = (estado: string, checked: boolean) => {
		setEstadoFilter((prev) => ({
			...prev,
			[estado]: checked,
		}));
	};
	const filtrarDenuncias = useCallback(() => {
		if (!denunciaData.length) return [];
		return denunciaData.filter((denuncia) => {
			if (fechaFilter) {
				const fechaDenuncia = new Date(denuncia.fecha_incidente)
					.toISOString()
					.split("T")[0];
				if (fechaDenuncia !== fechaFilter) return false;
			}
			if (
				motivoFilter &&
				motivoFilter !== "" &&
				denuncia.motivo_id !== motivoFilter
			)
				return false;

			const statesSelected = Object.values(estadoFilter).some(
				(value) => value
			);
			if (statesSelected) {
				const estadoDenuncia = denuncia.estado
					.toLowerCase()
					.replace(/\s+/g, "_");
				const statesCoincide = Object.entries(estadoFilter).some(
					([estado, seleccionado]) =>
						seleccionado && estadoDenuncia.includes(estado)
				);
				if (!statesCoincide) return false;
			}
			return true;
		});
	}, [denunciaData, fechaFilter, motivoFilter, estadoFilter]);
	const applyFilters = () => {
		const denunciasFiltradas = filtrarDenuncias();
		setDenunciasFiltradasData(denunciasFiltradas);
		setFiltered(true);

		if (denunciasFiltradas.length === 0) {
			toast.info("No se encontraron denuncias con los filtros aplicados");
		} else {
			toast.success(
				`Se encontraron ${denunciasFiltradas.length} denuncias con los filtros aplicados`
			);
		}
	};
	const clearFilters = () => {
		setFechaFilter("");
		setMotivoFilter("");
		setEstadoFilter({
			registrado: false,
			en_proceso: false,
			resuelto: false,
			rechazado: false,
			recibida: false
		});
		setFiltered(false);
		setDenunciasFiltradasData([]);
	};

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
		handleSearchClick,
		hasSearched,
		isLoadingDNI,
		toggleCardDetails,
		expandedCards,
		showFilters,
		handleShowFilters,
		motivos,
		fechaFilter,
		handleFechaFilterChange,
		motivoFilter,
		handleMotivoFIlterChange,
		estadoFilter,
		handleEstadoFilterChange,
		denunciasFiltradasData,
		applyFilters,
		clearFilters,
		filtered,
	};
};
