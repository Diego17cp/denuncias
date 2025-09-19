import axios from "axios";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthContextProps {
	isAuthenticated: boolean;
	user: User | null;
	login: (dni: string, password: string) => Promise<boolean>;
	logout: () => void;
	confirmLogout: (confirmation: string) => void;
	loading: boolean;
}

interface User {
	dni_admin: string;
	categoria: string;
	nombres: string;
	estado: "activo" | "inactivo" | "1" | "0";
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/admin-info`, {
					withCredentials: true,
				});
				if (response.data.user) {
					setIsAuthenticated(true);
					setUser(response.data.user);
				} else {
					setIsAuthenticated(false);
					setUser(null);
				}
			} catch {
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		checkAuth();
	}, []);

	const login = async (dni: string, password: string) => {
		try {
			const response = await axios.post(
				`${BASE_URL}/login`,
				{
					dni: dni,
					password: password,
				},
				{ withCredentials: true }
			);
			if (response.data.success) {
				setIsAuthenticated(true);
				setUser(response.data.user);
				return true;
			}
			return false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.error;
				if (errorMessage) {
					throw new Error(errorMessage);
				}
			}
			throw new Error("Error al iniciar sesión");
		}
	};
	const confirmLogout = (confirmation: string) => {
		if (confirmation === "si") {
			logout();
		}
	};
	const logout = async () => {
		await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
		setIsAuthenticated(false);
		setUser(null);
		navigate("/admin/login");
	};
	const checkUserInfo = async () => {
		try {
			if (!isAuthenticated) return;
			const response = await axios.get(`${BASE_URL}/admin-info`, {
				withCredentials: true,
			});

			if (response.data.forceLogout === true) {
				toast.error(
					"Tu sesión ha expirado o tu cuenta ha sido desactivada"
				);
				logout();
				return;
			}

			if (response.data.roleChanged) {
				setUser({
					dni_admin: response.data.user.dni_admin,
					categoria: response.data.user.categoria,
					nombres: response.data.user.nombres || "Administrador",
					estado: response.data.user.estado || "activo",
				});

				toast.info("Se ha actualizado tu información de usuario", {
					description: `Tu rol ha cambiado a ${
						response.data.user.categoria === "super_admin"
							? "Super Administrador"
							: "Administrador"
					}`,
				});
			}
		} catch (error) {
			console.error(
				"Error al verificar la información del usuario",
				error
			);
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 401) {
					if (error.response.data?.forceLogout) {
						toast.error(
							error.response.data?.error ||
								"Tu sesión ha expirado"
						);
						logout();
					}
				}
			}
		}
	};
	useEffect(() => {
		if (isAuthenticated) {
			checkUserInfo();
			const interval = setInterval(checkUserInfo, 30 * 1000);
			return () => clearInterval(interval);
		}
	}, [isAuthenticated]);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				login,
				logout,
				loading,
				confirmLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
