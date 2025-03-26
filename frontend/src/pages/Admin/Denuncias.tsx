import { useAdminDenuncias } from "../../hooks/useAdminDenuncias";

export const Denuncias = () => {
	const itemsPerPage = 10;
	const {
		loading,
		denunciasPaginadas,
		totalPages,
		currentPage,
		handleCurrentPage,
		handlePageChange,
	} = useAdminDenuncias(itemsPerPage);

	const getEstadoClass = (estado: string) => {
		switch (estado) {
			case "pendiente":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "en_proceso":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "resuelta":
				return "bg-green-100 text-green-800 border-green-200";
			case "rechazada":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<div className="container mx-auto my-8 px-4">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">
					Denuncias Disponibles
				</h2>
				<div className="text-sm text-gray-600">
					Mostrando {denunciasPaginadas.length} de{" "}
					{denunciasPaginadas.length} denuncias
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--primary-color)"></div>
				</div>
			) : (
				<>
					<div className="overflow-x-auto bg-white rounded-lg shadow">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-(--primary-color) text-white">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Código
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Motivo
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Fecha
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Estado
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Denunciante
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Denunciado
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
									>
										Acción
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{denunciasPaginadas.map((denuncia) => (
									<tr
										key={denuncia.tracking_code}
										className="hover:bg-gray-50 transition duration-150"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{denuncia.tracking_code}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<div className="text-sm font-medium text-gray-900">
												{denuncia.motivo}
											</div>
											<div className="text-sm text-gray-500 truncate max-w-xs">
												Contra:{" "}
												{denuncia.denunciado_nombre}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{new Date(
												denuncia.fecha_registro
											).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(
													denuncia.estado
												)}`}
											>
												{denuncia.estado.replace(
													"_",
													" "
												)}
											</span>
										</td>
										<td className="px-6 capitalize py-4 whitespace-nowrap text-sm text-gray-500">
											{denuncia.denunciante_nombre}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												// onClick={() =>
												// 	// asignarDenuncia(denuncia.id)
												// }
												className="bg-(--secondary-color) cursor-pointer text-white px-3 py-1.5 rounded hover:bg-(--primary-color) transition duration-300 ease-in-out flex items-center"
											>
												<i className="fas fa-plus mr-1.5"></i>
												Recibir
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Paginación */}
					<div className="flex justify-between items-center mt-6">
						<div className="text-sm text-gray-600">
							Página {currentPage} de {totalPages}
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() => handleCurrentPage("prev")}
								disabled={currentPage === 1}
								className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Anterior
							</button>

							{/* Números de página */}
							<div className="hidden sm:flex space-x-1">
								{Array.from(
									{ length: Math.min(5, totalPages) },
									(_, i) => {
										let pageNum;
										if (currentPage <= 3) {
											pageNum = i + 1;
										} else if (
											currentPage >=
											totalPages - 2
										) {
											pageNum = totalPages - 4 + i;
										} else {
											pageNum = currentPage - 2 + i;
										}
										if (
											pageNum <= 0 ||
											pageNum > totalPages
										)
											return null;

										return (
											<button
												key={pageNum}
												onClick={() =>
													handlePageChange(pageNum)
												}
												className={`px-3 py-2 border rounded-md text-sm font-medium ${
													pageNum === currentPage
														? "bg-(--primary-color) text-white border-(--primary-color)"
														: "text-gray-700 border-gray-300 hover:bg-gray-50"
												}`}
											>
												{pageNum}
											</button>
										);
									}
								)}
							</div>

							<button
								onClick={() => handleCurrentPage("next")}
								disabled={currentPage === totalPages}
								className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Siguiente
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};
