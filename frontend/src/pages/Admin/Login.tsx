import { useLogin } from "../../hooks/Admin/useLogin";
import { Loader } from "../../Components/Loaders/Loader";
import { useAuthContext } from "../../hooks/Admin/useAuthContext";
import { Navigate } from "react-router";
export const Login = () => {
	const {
		numeroDocumento,
		nombre,
		isLoading,
		handleDocumentoChange,
		handleName,
		toggleVisibility,
		isVisible,
		password,
		handlePassword,
		isDisabled,
		submitting,
		handleSubmit,
	} = useLogin();
	const { isAuthenticated, loading } = useAuthContext();
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader isBtn={false} />
			</div>
		);
	}
	if (isAuthenticated) {
		return <Navigate to="/admin/dashboard" />;
	}
	return (
		<div className="container mx-auto my-10 px-4 py-6 max-w-2xl">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
				Iniciar Sesión como Administrador
			</h2>
			<form className="rounded-lg p-6" onSubmit={handleSubmit}>
				<div className="space-y-6">
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part white-bg-focus"
							placeholder=" "
							value={numeroDocumento}
							onChange={handleDocumentoChange}
							minLength={8}
							maxLength={8}
							disabled={isLoading}
							required
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							DNI
							<span className="text-red-500 font-black">*</span>
						</label>
					</div>
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part white-bg-focus"
							placeholder=" "
							value={nombre}
							disabled={isLoading}
							readOnly
							onChange={handleName}
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Nombres y Apellidos
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</label>
						{isLoading && <Loader isBtn={false} />}
					</div>
					<div className="space-y-2 relative">
						<input
							type={isVisible ? "text" : "password"}
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
							value={password}
							onChange={handlePassword}
							minLength={8}
							disabled={isLoading}
							required
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Contraseña
							<span className="text-red-500 font-black">*</span>
						</label>
						<button
							className="absolute top-[45%] right-[.8em] px-1.5 py-0 bg-transparent text-(--primary-color) text-[1.3rem] cursor-pointer hover:text-(--secondary-color) transform -translate-y-1/2 transition-all duration-300 ease-in-out"
							onClick={toggleVisibility}
							type="button"
						>
							<i
								className={
									isVisible
										? "fa-solid fa-eye"
										: "fa-solid fa-eye-slash"
								}
							></i>
						</button>
					</div>
					<button
						className="w-full p-3.5 rounded-lg outline-none bg-(--secondary-color) cursor-pointer text-white text-lg transition-all duration-300 ease-in-out hover:bg-(--primary-color) hover:shadow-lg disabled:bg-(--gray-light) disabled:cursor-not-allowed flex justify-center items-center"
						type="submit"
						disabled={isDisabled || submitting}
					>
						{submitting ? (
							<Loader isBtn={true} />
						) : (
							"Iniciar Sesión"
						)}
					</button>
				</div>
			</form>
		</div>
	);
};
export default Login;