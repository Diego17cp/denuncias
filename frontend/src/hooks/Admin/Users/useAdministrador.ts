import { useCallback, useEffect, useState } from "react";
import { authApi } from "../../../utils/apiAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Administrador } from "../../../types";
import { useAuthContext } from "../useAuthContext";
interface AdminData {
	dni_admin: string;
	nombres: string;
	password: string;
	categoria: "admin" | "super_admin";
	estado: "activo" | "inactivo";
}

export const useAdministrador = () => {
	const { user } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [administradores, setAdministradores] = useState<Administrador[]>([]);
	const [editAction, setEditAction] = useState<{
		dni_admin: string | null;
		action: "password" | "state" | "role" | null;
	}>({
		dni_admin: null,
		action: null,
	});

	const getAdministradores = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await authApi.get("/administradores");
			setAdministradores(response.data);
		} catch (err) {
			const axiosError = err as AxiosError<{ message?: string }>;
			console.error("Error completo:", err);
			console.error("URL de la petición:", axiosError.config?.url);
			const errorMsg =
				axiosError.response?.data?.message ||
				"Error al obtener los administradores";
			setError(errorMsg);
			toast.error(errorMsg);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);
	const createAdministrador = async (
		data: AdminData
	): Promise<Administrador | undefined> => {
		setLoading(true);
		setError(null);
		try {
			const response = await authApi.post("/administradores", data);
			toast.success("Administrador creado exitosamente");
			return response.data;
		} catch (err) {
			const axiosError = err as AxiosError<{
				message?: string;
				error?: string;
			}>;
			console.error("Error completo:", err);
			console.error("Status:", axiosError.response?.status);
			console.error("Data:", axiosError.response?.data);
			let errorMsg = "Error al crear el administrador";
			if (
				axiosError.response?.status === 400 &&
				axiosError.response.data?.error?.includes("Ya existe")
			) {
				errorMsg = `El administrador con DNI ${data.dni_admin} ya está registrado en el sistema`;
			} else {
				errorMsg =
					axiosError.response?.data?.error ||
					axiosError.response?.data?.message ||
					"Error al crear el administrador";
			}
			setError(errorMsg);
			toast.error(errorMsg);
			return undefined;
		} finally {
			setLoading(false);
		}
	};
	const updateAdministrador = async (dni: string, accion: 'estado' | 'password' | 'categoria', datos: {
        estado?: 'activo' | 'inactivo';
        password?: string;
        categoria?: 'admin' | 'super_admin';
        motivo?: string;
    }): Promise<Administrador> => {
        setLoading(true);
        setError(null);
        try {
            const currentDniAdmin = user?.dni_admin || '';
			if (!currentDniAdmin) {
				throw new Error("No se encontró el DNI del administrador actual");
			}
            const response = await authApi.post(`/update`, {
				accion,
				dni_admin: currentDniAdmin,
				dni,
				motivo: datos.motivo || 'Actualización administrativa',
				estado: accion === 'estado' ? datos.estado : undefined,
				password: accion === 'password' ? datos.password : undefined,
				categoria: accion === 'categoria' ? datos.categoria : undefined,
			});
            if (response.data && response.data.admin) {
                toast.success(response.data.message || 'Actualización exitosa');
                setAdministradores(prevAdmins => 
					prevAdmins.map(a => a.dni_admin === dni ? response.data.admin : a)
				);
				return response.data.admin;
            } else {
                throw new Error("No se recibió mensaje de éxito en la respuesta");
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            console.error("Error completo:", err);
            console.error("URL de la petición:", axiosError.config?.url);
            const errorMsg =
                axiosError.response?.data?.message ||
                "Error al actualizar el administrador";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }
    const updateAdminPassword = async (dni:string, password:string, motivo: string = 'Cambio de contraseña') => {
        return updateAdministrador(dni, 'password', { password, motivo });
    }
    const updateAdminStatus = async (dni:string, estado:'activo' | 'inactivo', motivo: string = estado === 'activo' ? 'Reactivación de cuenta' : 'Desactivación de cuenta') => {
        return updateAdministrador(dni, 'estado', { estado, motivo });
    }
    const updateAdminRole = async (dni:string, categoria:'admin' | 'super_admin', motivo: string = `Cambio de rol a ${categoria}`) => {
        return updateAdministrador(dni, 'categoria', { categoria, motivo });
    }
	useEffect(() => {
		getAdministradores();
	}, [getAdministradores]);
	const handleEditAction = (dni_admin: string, action: "password" | "state" | "role") => {
		if (editAction.dni_admin === dni_admin && editAction.action === action) {
            setEditAction({ dni_admin: null, action: null });
        } else {
            setEditAction({ dni_admin, action });
        }
	};

	return {
		loading,
		error,
		getAdministradores,
		createAdministrador,
		updateAdministrador,
		administradores,
		handleEditAction,
		editAction,
        updateAdminPassword,
        updateAdminStatus,
        updateAdminRole,
	};
};

export default useAdministrador;
