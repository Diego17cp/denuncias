import { useEffect } from "react";
import { Loader } from "../../Components/Loaders/Loader";
import { useDenunciante } from "../../hooks/Form/useDenunciante";
import { useFormContext } from "../../hooks/Form/useFormContext";

export const DatosDenunciante = () => {
	const {
		tipoDatos,
		handleTipoDatos,
		tipoDocumento,
		handleTipoDocumento,
		sexo,
		handleSexo,
		nombre,
		numeroDocumento,
		handleDocumentoChange,
		isLoading,
		error,
		handleName,
		duplicatedDocError,
		checkDuplicatedDocument,
	} = useDenunciante();
	const {
		formData: { denunciante, denunciado },
		updateDenunciante,
		updateFormData,
	} = useFormContext();

	useEffect(() => {
		updateFormData("es_anonimo", tipoDatos === "anonimo");
		if (tipoDatos === "datos-personales") {
			updateDenunciante({
				...(denunciante || {}),
				nombres: nombre,
				tipo_documento: tipoDocumento,
				numero_documento: numeroDocumento,
				sexo,
				email: denunciante?.email,
				telefono: denunciante?.telefono,
			});
			if (denunciado && denunciado.numero_documento) {
				checkDuplicatedDocument(
					numeroDocumento,
					denunciado.numero_documento
				);
			}
		}
	}, [tipoDatos, nombre, tipoDocumento, numeroDocumento, sexo, denunciado]);
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<h3 className="font-medium text-gray-900">
					Identificación del denunciante
					<span className="text-red-500 font-black text-xl">*</span>
				</h3>
				<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
					<input
						type="radio"
						name="datos"
						id={`datos-personales`}
						className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
						checked={tipoDatos === "datos-personales"}
						onChange={() => handleTipoDatos("datos-personales")}
					/>
					<label
						htmlFor={`datos-personales`}
						className="flex-1 cursor-pointer"
					>
						<span className="font-medium text-gray-700">
							Denuncia con datos personales
						</span>
						<p className="text-gray-500 text-sm mt-1">
							Si eliges esta opción, los responsables de procesar
							tu denuncia recibirán tus datos y podrás recibir
							actualizaciones, además, podrás solicitar medidas de
							protección.
						</p>
					</label>
				</div>
				<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
					<input
						type="radio"
						name="datos"
						id={`anónimo`}
						className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
						checked={tipoDatos === "anonimo"}
						onChange={() => handleTipoDatos("anonimo")}
					/>
					<label
						htmlFor={`anónimo`}
						className="flex-1 cursor-pointer"
					>
						<span className="font-medium text-gray-700">
							Denuncia anónima
						</span>
						<p className="text-gray-500 text-sm mt-1">
							Eligiendo esta alternativa, nadie conocerá tu
							identidad, pero tampoco podrás añadir información a
							tu denuncia, recibir notificaciones sobre tu avance,
							ni pedir medidas de protección.
						</p>
					</label>
				</div>
			</div>
			{tipoDatos === "datos-personales" && (
				<div className="space-y-6">
					<div className="space-y-2">
						<label className="mb-2" htmlFor="tipo-documento">
							Tipo de Documento de Identidad del Denunciante
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</label>
						<select
							name="tipo-documento"
							id="tipo-documento"
							value={tipoDocumento}
							onChange={(e) =>
								handleTipoDocumento(e.target.value)
							}
							className="w-full cursor-pointer p-[1em] border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent text-(--secondary-color) focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out"
						>
							<option
								value=""
								disabled
								className="text-(--gray-light)"
							>
								Seleccione una opción
							</option>
							<option value="dni">DNI</option>
							<option value="ruc">RUC</option>
							<option value="carnet-extranjeria">
								Carnet de Extranjería
							</option>
						</select>
					</div>
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
							value={numeroDocumento}
							onChange={handleDocumentoChange}
							minLength={tipoDocumento === "dni" ? 8 : 11}
							maxLength={
								tipoDocumento === "dni"
									? 8
									: tipoDocumento === "ruc"
									? 11
									: 20
							}
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Nro de Documento de Identidad
							<span className="text-red-500 font-black">*</span>
						</label>
						{isLoading && <Loader isBtn={false} />}
					</div>
					{error && (
						<div className="text-red-500 text-xs mt-1">{error}</div>
					)}
					{duplicatedDocError && (
						<div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-10">
							<div className="flex items-center">
								<div className="flex-shrink-0 text-red-500">
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-red-700">
										{duplicatedDocError}
									</p>
								</div>
							</div>
						</div>
					)}
					<div className="space-y-2 relative">
						<input
							type="text"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
							value={nombre}
							disabled={isLoading}
							readOnly={
								tipoDocumento === "dni" ||
								tipoDocumento === "ruc" ||
								tipoDocumento === ""
							}
							onChange={
								tipoDocumento === "dni" ||
								tipoDocumento === "ruc" ||
								tipoDocumento === ""
									? undefined
									: handleName
							}
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Nombre del Denunciante
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</label>
					</div>
					<div className="space-y-2 relative">
						<input
							type="email"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
							value={denunciante?.email}
							onChange={(e) =>
								updateDenunciante({ email: e.target.value })
							}
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Correo del Denunciante
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</label>
					</div>
					<div className="space-y-2 relative">
						<input
							type="phone"
							className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
							placeholder=" "
							maxLength={9}
							value={denunciante?.telefono}
							onChange={(e) =>
								updateDenunciante({ telefono: e.target.value })
							}
						/>
						<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
							Teléfono del Denunciante
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</label>
					</div>
					<div className="space-y-4">
						<h3 className="font-medium text-gray-900">
							Sexo del denunciante
							<span className="text-red-500 font-black text-xl">
								*
							</span>
						</h3>
						<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
							<input
								type="radio"
								name="sexo"
								id={`masculino`}
								className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
								checked={sexo === "M"}
								onChange={() => handleSexo("M")}
							/>
							<label
								htmlFor={`masculino`}
								className="flex-1 cursor-pointer"
							>
								<span className="font-medium text-gray-700">
									Masculino
								</span>
							</label>
						</div>
						<div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all ease-in duration-300">
							<input
								type="radio"
								name="sexo"
								id={`femenino`}
								className="mt-1 w-5 h-5 cursor-pointer border-2 border-solid border-(--gray) rounded-full transition-all duration-300 ease-in-out hover:border-(--primary-color) checked:bg-(--primary-color) checked:border-(--primary-color) checked:bg-(image:--bg-radios) focus:outline-2 focus:outline-(--primary-color) focus:outline-offset-2 appearance-none"
								checked={sexo === "F"}
								onChange={() => handleSexo("F")}
							/>
							<label
								htmlFor={`femenino`}
								className="flex-1 cursor-pointer"
							>
								<span className="font-medium text-gray-700">
									Femenino
								</span>
							</label>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
