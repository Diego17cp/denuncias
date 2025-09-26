import { useDenunciado } from "../../hooks/Form/useDenunciado";
import { useFormContext } from "../../hooks/Form/useFormContext";
import { Loader } from "../../Components/Loaders/Loader";
import { useEffect } from "react";

export const DatosDenunciado = () => {
	const { formData, updateDenunciado } = useFormContext();
	const { denunciado } = formData;
	const {
		tipoDocumento,
		numeroDocumento,
		nombre,
		representanteLegal,
		razonSocial,
		cargo,
		isLoading,
		error,
		handleTipoDocumento,
		handleDocumentoChange,
		handleName,
		handleRepresentanteLegal,
		handleRazonSocial,
		handleCargo,
	} = useDenunciado();
	useEffect(() => {
		updateDenunciado({
			nombre,
			tipo_documento: tipoDocumento,
			numero_documento: numeroDocumento,
			cargo,
			representante_legal: representanteLegal,
			razon_social: razonSocial,
		});
	}, [
		nombre,
		tipoDocumento,
		numeroDocumento,
		cargo,
		representanteLegal,
		razonSocial,
	]);
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<label className="mb-2" htmlFor="tipo-documento">
					Tipo de Documento de Identidad del Denunciado
					<span className="text-red-500 font-black text-xl">*</span>
				</label>
				<select
					name="tipo-documento"
					id="tipo-documento"
					value={denunciado.tipo_documento}
					onChange={(e) => handleTipoDocumento(e.target.value)}
					className="w-full cursor-pointer p-[1em] border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent text-(--secondary-color) focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out"
				>
					<option value="" disabled className="text-(--gray-light)">
						Seleccione una opción
					</option>
					<option value="dni">DNI</option>
					<option value="ruc">RUC</option>
					<option value="CE">
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
			{error && <p className="text-red-500 text-sm">{error}</p>}
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
					Nombre del Denunciado
					<span className="text-red-500 font-black text-xl">*</span>
				</label>
			</div>
			<div className="space-y-2 relative">
				<input
					type="text"
					className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
					placeholder=" "
					value={cargo}
					onChange={handleCargo}
				/>
				<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
					Cargo del Denunciado
					<span className="text-red-500 font-black text-xl">*</span>
				</label>
			</div>
			{denunciado.tipo_documento === "ruc" && (
				<div className="space-y-2 relative">
					<input
						type="text"
						className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={representanteLegal}
						onChange={handleRepresentanteLegal}
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Representante Legal
					</label>
				</div>
			)}
			{denunciado.tipo_documento === "ruc" && (
				<div className="space-y-2 relative">
					<input
						type="text"
						className="w-full p-3.5 border-2 border-solid border-(--gray-light) rounded-lg outline-none bg-transparent focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-300 ease-in-out form-part"
						placeholder=" "
						value={razonSocial}
						onChange={handleRazonSocial}
					/>
					<label className="absolute top-[45%] left-[1em] px-1.5 py-0 pointer-events-none bg-transparent text-(--gray-light) text-base transform -translate-y-1/2 transition-all duration-300 ease-in-out">
						Razón Social
					</label>
				</div>
			)}
		</div>
	);
};
