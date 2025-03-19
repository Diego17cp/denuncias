import { useFormContext } from "../hooks/useFormContext";
import { Loader } from "./Loader";
// import { toast } from "sonner";

export const FormNavigator = () => {
	const { currentPage, nextPage, prevPage, submitForm, isLoading } =
		useFormContext();

	const TOTAL_PAGES = 4;

	const SUBMIT_PAGE = 3;

	const handleNext = () => {
		// validaciones despues
		nextPage();
	};
	const handleSubmit = async () => {
		const success: boolean = await submitForm();
		if (success) {
			nextPage();
		}
	};
	return (
		<div className="flex justify-end mt-8 w-full">
			{currentPage > 1 && currentPage !== TOTAL_PAGES && (
				<button
					type="button"
					onClick={prevPage}
					disabled={isLoading}
					className="px-5 md:px-10 py-4 border border-(--gray-light) rounded-md text-(--gray) cursor-pointer hover:scale-105 hover:bg-gray-300 transition-all ease-out duration-300 bg-gray-200 mr-auto"
				>
					Atrás
				</button>
			)}
			{currentPage < SUBMIT_PAGE ? (
				<button
					type="button"
					onClick={handleNext}
					disabled={isLoading}
					className={`px-4 md:px-8 py-4 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
				>
					Siguiente
				</button>
			) : currentPage === SUBMIT_PAGE ? (
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className={`px-4 md:px-8 py-4 bg-(--secondary-color) text-white rounded-md text-center hover:bg-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
				>
					{isLoading ? <Loader isBtn={true} /> : "Enviar Denuncia"}
				</button>
			) : (
				<div className="w-1/2 flex justify-center items-center my-0 mx-auto">
					<button
						type="button"
						onClick={() => (window.location.href = "/")}
						className={`w-full px-4 md:px-8 py-4 border-4 border-solid border-(--secondary-color) text-(--secondary-color) rounded-md text-center hover:bg-(--primary-color) hover:text-white hover:border-(--primary-color) cursor-pointer text-lg hover:scale-105 transition-all ease-out duration-300`}
					>
						<span className="flex items-center justify-center text-2xl font-semibold text-center h-full w-full">
							<i className="fa-duotone fa-solid fa-file-pdf me-5"></i>
							Descargar PDF
						</span>
					</button>
				</div>
			)}
		</div>
	);
};
