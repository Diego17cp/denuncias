import { Suspense, lazy } from "react";
// Styles
import "./App.css";
// Dependencias externas
import { Toaster } from "sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
// Contexto
import { AuthProvider } from "./context/AuthenticationContext";
// Componentes
import { Layout } from "./Components/Layout";
import { DenunciasLayout } from "./Components/DenunciasLayout";
import { UsersLayout } from "./Components/UsersLayout";
const FormularioDenuncia = lazy(() => import("./Components/Form/FormDenuncia"));
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { Loader } from "./Components/Loaders/Loader";
// Páginas Admin
const Login = lazy(() => import("./pages/Admin/Login"));
const Denuncias = lazy(() => import("./pages/Admin/Denuncias/Denuncias"));
const DashboardAdmin = lazy(() => import("./pages/Admin/Dashboard"));
const AdminsHistorial = lazy(() => import("./pages/Admin/AdminsHistorial"));
const AdministrarUsuarios = lazy(() => import("./pages/Admin/AdministrarUsuarios/AdministrarUsuarios"));
const DenunciasRecibidas = lazy(() => import("./pages/Admin/Denuncias/DenunciasRecibidas"));
const SearchAdmin = lazy(() => import("./pages/Admin/AdministrarUsuarios/SearchAdmin"));
const SearchDenuncia = lazy(() => import("./pages/Admin/Denuncias/SearchDenuncia"));
// Páginas Generales
const TrackingDenuncia = lazy(() => import("./pages/Tracking/TrackingDenuncia"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/404"));

function App() {
	return (
		<BrowserRouter basename="/">
			<AuthProvider>
				<Suspense
					fallback={
						<div className="flex items-center justify-center min-h-screen w-full">
							<Loader isBtn={true} />
						</div>
					}
				>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<FormularioDenuncia />} />
							<Route
								path="/tracking-denuncia"
								element={<TrackingDenuncia />}
							/>
							<Route path="/admin/login" element={<Login />} />
							<Route
								path="/unauthorized"
								element={<Unauthorized />}
							/>
							<Route
								path="/admin"
								element={
									<ProtectedRoute
										allowedRoles={["super_admin", "admin"]}
									>
										<Navigate
											to="/admin/dashboard"
											replace
										/>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/dashboard"
								element={
									<ProtectedRoute
										allowedRoles={["super_admin", "admin"]}
									>
										<DashboardAdmin />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/users"
								element={
									<ProtectedRoute
										allowedRoles={["super_admin"]}
									>
										<UsersLayout />
									</ProtectedRoute>
								}
							>
								<Route
									index
									element={<AdministrarUsuarios />}
								/>
								<Route
									path="search"
									element={<SearchAdmin />}
								/>
							</Route>
							<Route
								path="/admin/historial-admins"
								element={
									<ProtectedRoute
										allowedRoles={["super_admin"]}
									>
										<AdminsHistorial />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/denuncias"
								element={
									<ProtectedRoute
										allowedRoles={["super_admin", "admin"]}
									>
										<DenunciasLayout />
									</ProtectedRoute>
								}
							>
								<Route index element={<Denuncias />} />
								<Route
									path="recibidos"
									element={<DenunciasRecibidas />}
								/>
								<Route
									path="search"
									element={<SearchDenuncia />}
								/>
							</Route>
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</Suspense>
			</AuthProvider>
			<Toaster richColors closeButton />
		</BrowserRouter>
	);
}

export default App;
