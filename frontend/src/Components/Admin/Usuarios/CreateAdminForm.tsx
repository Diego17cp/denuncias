import { Loader } from "../../Loaders/Loader";
import { useEditAdmin } from "../../../hooks/Admin/Users/useEditAdmin";
import React, { useState } from "react";

interface CreateAdminFormProps {
	onCancel: () => void;
	onCreate: () => void;
}

export const CreateAdminForm: React.FC<CreateAdminFormProps> = ({
	onCancel,
	onCreate,
}) => {
	const {
		formData,
		isLoading,
		error,
		updateField,
		handleDNIChange,
		handleSubmit,
	} = useEditAdmin(null, onCreate, "create");

	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	return (
		<div className="animate__animated animate__fadeIn">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="p-6 bg-white rounded-lg"
			>
				{error && (
					<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md animate__animated animate__fadeIn">
						<div className="flex">
							<div className="flex-shrink-0">
								<i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							DNI <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<i className="fas fa-id-card text-(--secondary-color)"></i>
							</div>
							<input
								type="text"
								value={formData.dni_admin}
								onChange={(e) =>
									handleDNIChange(e.target.value)
								}
								className="w-full pl-10 pr-3 py-2.5 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								placeholder="Ingrese el DNI (8 dígitos)"
								maxLength={8}
								disabled={isLoading}
								required
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Nombres y Apellidos{" "}
							<span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<i className="fas fa-user text-(--secondary-color)"></i>
							</div>
							<input
								type="text"
								value={formData.nombres}
								onChange={(e) =>
									updateField("nombres", e.target.value)
								}
								className="w-full pl-10 pr-3 py-2.5 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								placeholder="Nombres completos"
								// disabled={isLoading}
                                // readOnly
								required
							/>
							{isLoading && (
								<div className="absolute right-2 top-1/2 transform -translate-y-1/2">
									<Loader isBtn={false} />
								</div>
							)}
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Contraseña <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<i className="fas fa-lock text-(--secondary-color)"></i>
							</div>
							<input
								type={passwordVisible ? "text" : "password"}
								value={formData.password}
								onChange={(e) =>
									updateField("password", e.target.value)
								}
								className="w-full pl-10 pr-10 py-2.5 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								placeholder="Mínimo 8 caracteres"
								disabled={isLoading}
								required
							/>
							<button
								type="button"
								onClick={() =>
									setPasswordVisible(!passwordVisible)
								}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-(--secondary-color) cursor-pointer transition-all duration-300 ease-in-out hover:text-(--primary-color)"
							>
								<i
									className={`fas ${
										passwordVisible
											? "fa-eye-slash"
											: "fa-eye"
									}`}
								></i>
							</button>
						</div>
						<p className="mt-1 text-xs text-gray-500">
							Debe tener al menos 8 caracteres
						</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Confirmar Contraseña{" "}
							<span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<i className="fas fa-lock text-(--secondary-color)"></i>
							</div>
							<input
								type={
									confirmPasswordVisible ? "text" : "password"
								}
								value={formData.confirmPassword}
								onChange={(e) =>
									updateField(
										"confirmPassword",
										e.target.value
									)
								}
								className="w-full pl-10 pr-10 py-2.5 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								placeholder="Confirme la contraseña"
								disabled={isLoading}
								required
							/>
							<button
								type="button"
								onClick={() =>
									setConfirmPasswordVisible(
										!confirmPasswordVisible
									)
								}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-(--secondary-color) cursor-pointer transition-all duration-300 ease-in-out hover:text-(--primary-color)"
							>
								<i
									className={`fas ${
										confirmPasswordVisible
											? "fa-eye-slash"
											: "fa-eye"
									}`}
								></i>
							</button>
						</div>
					</div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Categoría <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fas fa-tags text-(--secondary-color)"></i>
                            </div>
                            <select
                                value={formData.categoria}
                                onChange={(e) =>
                                    updateField(
                                        "categoria",
                                        e.target.value as "admin" | "super_admin"
                                    )
                                }
                                className="w-full pl-10 py-2.5 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all duration-200"
                                disabled={isLoading}
                            >
                                <option value="admin">Administrador</option>
                                <option value="super_admin">
                                    Super Administrador
                                </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <i className="fas fa-chevron-down text-(--secondary-color)"></i>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Los Super Administradores tienen acceso a todas las
                            funciones del sistema
                        </p>
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 border cursor-pointer border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <i className="fas fa-times"></i>
                            <span>Cancelar</span>
                        </button>
                        <button
                            type="submit"
                            className="disabled:cursor-not-allowed disabled:bg-gray-400 px-5 py-2.5 cursor-pointer bg-(--secondary-color) text-white rounded-md hover:bg-(--primary-color) transition-colors duration-200 flex items-center gap-2 shadow-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader isBtn={true} />
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    <span>Crear Administrador</span>
                                </>
                            )}
                        </button>
                    </div>
				</div>
			</form>
		</div>
	);
};
