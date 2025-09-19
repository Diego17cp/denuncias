import { Link } from "react-router";
import { useAuthContext } from "../../hooks/Admin/useAuthContext";

export const DashboardAdmin = () => {
	const { user } = useAuthContext();
	const userRole = user?.rol || "";
	const MENU_ITEMS_DASHBOARD = [
		{
			title: "Administrar Usuarios",
			icon: "fa-duotone fa-solid fa-user-tie",
			link: "/admin/users",
			allowedRoles: ["super_admin"],
		},
		{
			title: "Administrar Denuncias",
			icon: "fa-duotone fa-solid fa-circle-exclamation",
			link: "/admin/denuncias",
			allowedRoles: ["super_admin", "admin"],
		},
		{
			title: "Historial de Administradores",
			icon: "fa-duotone fa-solid fa-rectangle-history-circle-user",
			link: "/admin/historial-admins",
			allowedRoles: ["super_admin"],
		},
	];
	const allowedMenuItems = MENU_ITEMS_DASHBOARD.filter((item) =>
		item.allowedRoles.includes(userRole)
	);
	return (
		<div className="container mx-auto my-10 px-4 py-6 max-w-5xl">
			<h2 className="text-2xl text-center font-bold mb-6 text-gray-800 font-(family-name:--titles) animate__animated animate__fadeInDown">
				Panel de Administración
			</h2>
			<div className="text-center mb-8">
				<p className="text-gray-600">
					<span className="font-semibold">Usuario:</span>{" "}
					{user?.nombre || ""}
				</p>
				<p className="text-gray-600">
					<span className="font-semibold">Rol:</span>{" "}
					{userRole === "super_admin"
						? "Super Administrador"
						: "Administrador"}
				</p>
			</div>
			<main className={`grid grid-cols-1 gap-14 group ${allowedMenuItems.length === 1 ? "place-items-center" : "md:grid-cols-3 "}`}>
				{allowedMenuItems.map((item) => (
					<Link
						to={item.link}
						key={item.title}
						className="col-span-1 rounded-2xl text-(--secondary-color) shadow-lg backdrop-blur-2xl backdrop-saturate-100 bg-[#3a46500d] p-8 text-center flex flex-col items-center justify-center gap-5 transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 hover:text-(--primary-color) hover:scale-105"
					>
                        <h1 className="text-xl font-(family-name:--titles) font-semibold">
                            {item.title}
                        </h1>
						<i
							className={`text-5xl ${item.icon}`}
						></i>
						
					</Link>
				))}
			</main>
		</div>
	);
};
export default DashboardAdmin;