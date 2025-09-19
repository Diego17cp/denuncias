import { useEffect, useState } from "react";
import { getDNIData } from "../../services/apisDocs";
import { toast } from "sonner";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
	const [numeroDocumento, setNumeroDocumento] = useState<string>("");
	const [nombre, setNombre] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [password, setPassword] = useState<string>("");
	const [submitting, setSubmitting] = useState<boolean>(false);

	const { login } = useAuthContext();

	const toggleVisibility = () => {
		setIsVisible((prev) => !prev);
	};
	const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const documentoValue = e.target.value.replace(/\D/g, "");
		setNumeroDocumento(documentoValue);
	};
	const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		setNombre(nameValue);
	};
	const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const passwordValue = e.target.value;
		setPassword(passwordValue);
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isDisabled || submitting) return;
		setSubmitting(true);
		setError(null);
		try {
			const success = await login(numeroDocumento, password);
			if (success) {
				toast.success("Inicio de sesión exitoso");
			}
		} catch (error) {
			let errorMessage = "Error al iniciar sesión";
			
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (axios.isAxiosError(error) && error.response?.data?.error) {
				errorMessage = error.response.data.error;
			}
			
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};
	useEffect(() => {
		const fetchDniData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const nombre = await getDNIData(numeroDocumento);
				if (nombre) {
					setNombre(nombre);
				} else {
					const errMsg =
						"No se encontraron datos con el DNI ingresado";
					setError(errMsg);
					toast.error(errMsg);
				}
			} catch (error) {
				console.error(error);
				setError("Ocurrió un error al buscar los datos del DNI");
				toast.error("Ocurrió un error al buscar los datos del DNI");
			} finally {
				setIsLoading(false);
			}
		};
		if (numeroDocumento.length === 8) {
			fetchDniData();
		}
	}, [numeroDocumento]);

	useEffect(() => {
		if (numeroDocumento.length === 8 && password.length >= 8) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [numeroDocumento, password]);

	return {
		numeroDocumento,
		nombre,
		isLoading,
		error,
		handleDocumentoChange,
		handleName,
		isVisible,
		toggleVisibility,
		isDisabled,
		handlePassword,
		password,
		handleSubmit,
		submitting,
	};
};
