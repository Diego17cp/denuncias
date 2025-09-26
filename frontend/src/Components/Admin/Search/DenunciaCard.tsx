import { getStatusColor } from "../../../utils";
import { CalendarIcon, MiniDocumentIcon } from "../../Icons";
import { Denuncias as DenunciasSearch } from "../../../hooks/Admin/Denuncias/useSearchDenuncia";

interface DenunciaCardProps {
	denuncia: DenunciasSearch;
    nombre: string | null;
    numeroDocumento: string | null;
    expandedCards: Record<string, boolean>;
    toggleCardDetails: (id: string) => void;
}

export const DenunciaCard = ({
	denuncia,
	expandedCards,
	toggleCardDetails,
}: DenunciaCardProps) => {
	return (
		<div
			key={denuncia.id}
			className="bg-white rounded-xl relative shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
			style={{
				height: "auto",
				alignSelf: "start",
			}}
		>
			<div className="p-5 flex-grow flex flex-col">
				<div className="flex justify-between items-start mb-3 flex-wrap">
					<h4 className="text-lg font-medium text-gray-800 flex items-center">
						<MiniDocumentIcon />
						<span className="font-semibold tracking-wide">
							{denuncia.tracking_code}
						</span>
					</h4>
					<span
						className={`px-3 py-1 text-xs rounded-full capitalize font-semibold ${getStatusColor(
							denuncia.estado
						)}`}
					>
						{denuncia.estado.replace("_", " ")}
					</span>
				</div>
				<div
					className="space-y-2 flex-grow"
					style={{
						minHeight: 120,
					}}
				>
					<div className="flex items-center text-sm text-gray-500">
						<span className="text-indigo-600">
							<CalendarIcon />
						</span>
						{denuncia.fecha_incidente}
					</div>
					<div className="mt-2">
						<span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md">
							{denuncia.motivo_id === "8"
								? denuncia.motivo_otro
								: denuncia.motivo}
						</span>
					</div>

					<div
						className={`mt-3 text-sm text-gray-600 ${
							!expandedCards[denuncia.id] && "line-clamp-2"
						}`}
					>
						<p>{denuncia.descripcion}</p>
					</div>
				</div>
				<div
					className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
						expandedCards[denuncia.id]
							? "max-h-96 opacity-100"
							: "max-h-0 opacity-0"
					}`}
				>
					<div className="pt-4 border-t border-gray-100">
						<div className="space-y-4">
							<div>
								<h5 className="text-sm font-medium text-gray-700 mb-1">
									Información del denunciante
								</h5>
								<p className="text-sm text-gray-600">
									{denuncia.denunciante_nombre ||
										"Información no disponible"}
									{denuncia.denunciante_dni &&
										` - ${denuncia.denunciante_dni}`}
								</p>
							</div>
							<div>
								<h5 className="text-sm font-medium text-gray-700 mb-1">
									Información del denunciado
								</h5>
								<p className="text-sm text-gray-600">
									{denuncia.denunciado_nombre || "Información no disponible"}
									{denuncia.denunciado_dni && ` - ${denuncia.denunciado_dni}`}
								</p>
							</div>
							{denuncia.seguimiento_comentario && (
								<div>
									<h5 className="text-sm font-medium text-gray-700 mb-1">
										Comentarios de seguimiento
									</h5>
									<p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md italic">
										{denuncia.seguimiento_comentario}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="mt-auto border-t border-gray-100 bg-gray-50 px-5 py-3">
				<button
					className="w-full cursor-pointer text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
					onClick={() => toggleCardDetails(denuncia.id)}
				>
					{expandedCards[denuncia.id] ? (
						<>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 15l7-7 7 7"
								/>
							</svg>
							Ocultar detalles
						</>
					) : (
						<>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
							Ver detalles
						</>
					)}
				</button>
			</div>
		</div>
	);
};
