import { DatosDenunciado } from "../../pages/Form/DatosDenunciado";
import { DatosDenunciante } from "../../pages/Form/DatosDenunciante";
import { InfoDenuncia } from "../../pages/Form/InfoDenuncia";
import { useFormContext } from "../../hooks/Form/useFormContext";
import { FormNavigator } from "./FormNavigator";
import { FormProgressBar } from "./FormProgressBar";
import { ResumenDenuncia } from "../../pages/Form/ResumenDenuncia";

// import ResumenDenuncia from "../components/ResumenDenuncia";

const FormularioDenuncia: React.FC = () => {
	const {
		currentPage,
		error,
	} = useFormContext();

	// Renderizar la página actual
	const renderPage = () => {
		switch (currentPage) {
			case 1:
				return <InfoDenuncia />;
			case 2:
				return <DatosDenunciado />;
			case 3:
				return <DatosDenunciante />;
			case 4:
				return <ResumenDenuncia />;
			default:
				return <InfoDenuncia />;
		}
	};
	return (
		<div className="container mx-auto px-4 py-6 max-w-3xl">
			<h2 className="text-2xl text-center font-bold mb-8 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
				Sistema de Denuncias de Corrupción - MDJLO
			</h2>

			{/* Barra de progreso - mantiene tu diseño existente */}
			<FormProgressBar />
			{/* Mensaje de error global - mantiene tu diseño existente */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{/* Formulario */}
			<form
				className="rounded-lg p-6 shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d] animate__animated animate__fadeIn"
				onSubmit={(e) => e.preventDefault()}
			>
				{renderPage()}
				<FormNavigator />
			</form>
		</div>
	);
};

export default FormularioDenuncia;
