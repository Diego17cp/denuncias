import { useCallback, useEffect, useState } from "react";
import { Administrador, Action } from "../../../types";
import useAdministrador from "./useAdministrador";
import { toast } from "sonner";
import { getDNIData } from "../../../services/apisDocs";

interface FormData {
	dni_admin: string;
	nombres: string;
	password: string;
	confirmPassword: string;
	categoria: Administrador["categoria"];
	estado: Administrador["estado"];
	motivo: string;
}

export const useEditAdmin = (
	admin: Administrador | null,
	onComplete: () => void,
	actionType: Action | "create"
) => {
	const {
		loading: apiLoading,
		updateAdminPassword,
		updateAdminStatus,
		updateAdminRole,
		createAdministrador,
	} = useAdministrador();

	const [isLoadingDNI, setIsLoadingDNI] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		dni_admin: "",
		nombres: "",
		password: "",
		confirmPassword: "",
		categoria: "admin",
		estado: "activo",
		motivo: "",
	});
	const [error, setError] = useState<string | null>(null);
	const isLoading = apiLoading || isLoadingDNI;

	// Efecto para cargar datos del administrador al editar o limpiar el formulario al crear
	useEffect(() => {
		if (admin) {
			setFormData({
				dni_admin: admin.dni_admin,
				nombres: admin.nombres,
				password: "",
				confirmPassword: "", // Añadir aquí la confirmación
				categoria: admin.categoria,
				estado: admin.estado,
				motivo: "",
			});
		} else if (actionType === "create") {
			setFormData({
				dni_admin: "",
				nombres: "",
				password: "",
				confirmPassword: "", // Añadir aquí la confirmación
				categoria: "admin",
				estado: "activo",
				motivo: "",
			});
		}
		setError(null);
	}, [admin, actionType]);

	const handleDNIChange = useCallback(async (dni: string) => {
		const cleanDNI = dni.replace(/\D/g, ""); // Solo permitir números

		setFormData((prev) => ({
			...prev,
			dni_admin: cleanDNI,
			nombres: "", // Limpiar nombre cuando cambia el DNI
		}));

		if (cleanDNI.length === 8) {
			setIsLoadingDNI(true);
			try {
				const nombreCompleto = await getDNIData(cleanDNI);
				if (nombreCompleto) {
					setFormData((prev) => ({
						...prev,
						nombres: nombreCompleto,
					}));
				} else {
					toast.error("No se encontraron datos para este DNI");
				}
			} catch (error) {
				console.error("Error al consultar DNI:", error);
				toast.error("Error al consultar el DNI");
			} finally {
				setIsLoadingDNI(false);
			}
		}
	}, []);
	const updateField = useCallback((field: keyof FormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Limpiar errores al cambiar cualquier campo
		setError(null);
	}, []);
	const handlePasswordSubmit = useCallback(async () => {
		// Validaciones
		if (formData.password !== formData.confirmPassword) {
			setError("Las contraseñas no coinciden");
			return false;
		}

		if (formData.password.length < 8) {
			setError("La contraseña debe tener al menos 8 caracteres");
			return false;
		}

		try {
			// Usar la función específica para contraseñas
			await updateAdminPassword(
				admin?.dni_admin || "",
				formData.password,
				"Cambio de contraseña programado"
			);
			// Limpiar y notificar éxito
			setFormData((prev) => ({
				...prev,
				password: "",
				confirmPassword: "", // Añadir aquí la confirmación
			}));

			if (onComplete) onComplete();
			return true;
		} catch (error) {
			console.error("Error al actualizar contraseña:", error);
			return false;
		}
	}, [
		formData.password,
		formData.confirmPassword,
		admin,
		updateAdminPassword,
		onComplete,
	]);

	// Gestión de cambio de categoría
	const handleCategorySubmit = useCallback(async () => {
		// Validar que haya cambios
		if (!formData.motivo?.trim()) {
			setError("Debe ingresar un motivo para cambiar la categoría");
			return false;
		}
		try {
			if (admin) {
				await updateAdminRole(
					admin.dni_admin,
					formData.categoria,
					formData.motivo
				);
				window.location.reload();
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error al actualizar categoría:", error);
			return false;
		}
	}, [formData.categoria, formData.motivo, admin, updateAdminRole]);

	// Gestión de cambio de estado
	const handleStatusSubmit = useCallback(async () => {
		// No validamos aquí ya que generalmente esto se maneja con un toggle
		if (!formData.motivo?.trim()) {
			setError("Debe ingresar un motivo para el cambio de estado");
			return false;
		}
		try {
			if (admin) {
				const newStatus =
					admin.estado === "activo" ? "inactivo" : "activo";
				await updateAdminStatus(
					admin.dni_admin,
					newStatus,
					formData.motivo
				);
				window.location.reload(); // Recargar la página para reflejar el cambio de estado
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error al actualizar estado:", error);
			return false;
		}
	}, [formData.motivo, admin, updateAdminStatus]);

	const handleCreateSubmit = useCallback(async () => {
		if (formData.dni_admin.length !== 8) {
			setError("El DNI debe tener 8 dígitos");
			return false;
		}
		if (formData.password.length < 8) {
			setError("La contraseña debe tener al menos 8 caracteres");
			return false;
		}
		try {
			await createAdministrador({
				dni_admin: formData.dni_admin,
				nombres: formData.nombres,
				password: formData.password,
				categoria: formData.categoria,
				estado: "activo",
			});

			// Limpiar formulario
			setFormData({
				dni_admin: "",
				nombres: "",
				password: "",
				confirmPassword: "", // Añadir aquí la confirmación
				categoria: "admin",
				estado: "activo",
				motivo: "",
			});

			if (onComplete) onComplete();
			return true;
		} catch (error) {
			console.error("Error:", error);
			return false;
		}
	}, [formData, createAdministrador, onComplete]);
	const handleSubmit = useCallback(
		async (e?: React.FormEvent) => {
			if (e) e.preventDefault();
			switch (actionType) {
				case "password":
					return await handlePasswordSubmit();
				case "state":
					return await handleStatusSubmit();
				case "role":
					return await handleCategorySubmit();
				case "create":
					return await handleCreateSubmit();
				default:
					return false;
			}
		},
		[
			actionType,
			handlePasswordSubmit,
			handleStatusSubmit,
			handleCategorySubmit,
			handleCreateSubmit,
		]
	);
	return {
		// Estados
		formData,
		isLoading,
		error,

		handleDNIChange,
		updateField,
		handleSubmit,

		// Submit handlers
		handlePasswordSubmit,
		handleCategorySubmit,
		handleStatusSubmit,
		handleCreateSubmit,

		// Helper para toggle de estado
		toggleStatus: handleStatusSubmit,
	};
};

export default useEditAdmin;
