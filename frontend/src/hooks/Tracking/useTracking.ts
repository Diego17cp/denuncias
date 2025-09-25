import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useFormContext } from "../Form/useFormContext";
export const useTracking = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [trackingCode, setTrackingCode] = useState<string>(
		searchParams.get("codigo") || ""
	);
	const [displayTrackingCode, setDisplayTrackingCode] = useState<string>(
		searchParams.get("codigo") || ""
	);
	const {
		trackingData,
		trackingLoading,
		trackingError,
		resetTracking,
		consultarTracking,
	} = useFormContext();

	useEffect(() => {
		const codigo = searchParams.get("codigo");
		if (codigo && codigo.trim() !== "") {
			setTrackingCode(codigo);
			setDisplayTrackingCode(codigo);
			consultarTracking(codigo);
		}
		return () => resetTracking();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTrackingCode(e.target.value);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const success = await consultarTracking(trackingCode);
		if (success) {
			setSearchParams({ codigo: trackingCode });
			setDisplayTrackingCode(trackingCode);
		}
	};
	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case "registrado":
			case "registrada":
				return "fa-file-circle-check";
			case "recibida":
				return "fa-inbox";
			case "en_proceso":
			case "en proceso":
				return "fa-clock";
			case "finalizado":
			case "resuelto":
				return "fa-check-circle";
			case "rechazado":
				return "fa-times-circle";
			default:
				return "fa-circle-info";
		}
	};
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("es-PE", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	const getGlowColorFromStatus = (status: string): string => {
		switch (status) {
			case "registrado":
			case "registrada":
				return "var(--registrado-bg)";
			case 'recibida':
				return "var(--recibida-bg)";
			case "en_proceso":
				return "var(--en_proceso-bg)";
			case "finalizado":
			case "resuelto":
				return "var(--finalizado-bg)";
			case "rechazado":
				return "var(--rechazado-bg)";
			default:
				return "var(--default-glow-bg)";
		}
	};
	return {
		trackingCode,
		handleInputChange,
		handleSubmit,
		getStatusIcon,
		trackingData,
		trackingLoading,
		trackingError,
		formatDate,
		displayTrackingCode,
		getGlowColorFromStatus,
	};
};
