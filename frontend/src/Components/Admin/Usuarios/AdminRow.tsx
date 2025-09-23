import { Administrador } from "../../../types";
import {
	getEstadoColor,
	getEstadoColorBtn,
	getEstadoIcon,
	getTypeColor,
} from "../../../utils";

interface AdminRowProps {
	admin: Administrador;
	expandedRow: string | null;
	toggleExpand: (dni: string, action: "password" | "state" | "role") => void;
}

export const AdminRow = ({
	expandedRow,
	admin,
	toggleExpand,
}: AdminRowProps) => {
	return (
		<tr
			className={`hover:bg-gray-50 ${
				expandedRow === admin.dni_admin ? "bg-gray-50 border-b-0" : ""
			}`}
		>
			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
				{admin.dni_admin}
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{admin.nombres}
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm">
				<span
					className={`capitalize px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
						admin.categoria
					)}`}
				>
					{admin.categoria.replace("_", " ")}
				</span>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm">
				<span
					className={`capitalize px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
						admin.estado
					)}`}
				>
					{admin.estado}
				</span>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				<div className="flex flex-wrap items-center gap-3">
					<div className="relative group">
						<button
							onClick={() =>
								toggleExpand(admin.dni_admin, "password")
							}
							className="h-9 w-9 flex cursor-pointer items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 shadow-sm hover:shadow transition-all duration-300"
							aria-label="Cambiar contraseña"
						>
							<i className="fas fa-key text-sm"></i>
						</button>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 pointer-events-none">
							<div
								className="bg-(--primary-color) text-white text-xs rounded py-1.5 px-3 whitespace-nowrap mb-2
									opacity-0 group-hover:opacity-100 
									translate-y-1 group-hover:translate-y-0 
									scale-95 group-hover:scale-100
									transition-all duration-200 ease-out"
							>
								Cambiar contraseña
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-(--primary-color)"></div>
							</div>
						</div>
					</div>
					<div className="relative group">
						<button
							onClick={() =>
								toggleExpand(admin.dni_admin, "state")
							}
							className={`h-9 w-9 flex cursor-pointer items-center justify-center rounded-full shadow-sm hover:shadow transition-all duration-300 ${getEstadoColorBtn(
								admin.estado
							)}`}
							aria-label="Cambiar estado"
						>
							<i
								className={`fas ${getEstadoIcon(admin.estado)} text-sm`}
							></i>
						</button>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 pointer-events-none">
							<div
								className="bg-(--primary-color) text-white text-xs rounded py-1.5 px-3 whitespace-nowrap mb-2
									opacity-0 group-hover:opacity-100 
									translate-y-1 group-hover:translate-y-0 
									scale-95 group-hover:scale-100
									transition-all duration-200 ease-out"
							>
								{admin.estado === "activo"
									? "Desactivar"
									: "Activar"}
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-(--primary-color)"></div>
							</div>
						</div>
					</div>
					<div className="relative group">
						<button
							onClick={() =>
								toggleExpand(admin.dni_admin, "role")
							}
							className="h-9 w-9 flex cursor-pointer items-center justify-center rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 shadow-sm hover:shadow transition-all duration-300"
							aria-label="Cambiar categoría"
						>
							<i className="fas fa-tags text-sm"></i>
						</button>
						<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 pointer-events-none">
							<div
								className="bg-(--primary-color) text-white text-xs rounded py-1.5 px-3 whitespace-nowrap mb-2
									opacity-0 group-hover:opacity-100 
									translate-y-1 group-hover:translate-y-0 
									scale-95 group-hover:scale-100
									transition-all duration-200 ease-out"
							>
								Cambiar categoría
								<div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-(--primary-color)"></div>
							</div>
						</div>
					</div>
				</div>
			</td>
		</tr>
	);
};
