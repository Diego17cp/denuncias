import { Link } from "react-router";

export const UsersManagement = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Usuarios</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
                En construcción
            </h2>
            <p className="text-lg text-gray-600 max-w-md text-center mb-8">
                Estamos trabajando en esta sección, por favor regrese más tarde.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/"
                    className="bg-(--secondary-color) text-white px-6 py-3 rounded-lg hover:bg-(--primary-color) transition-all duration-300 ease-in-out"
                >
                    Volver al inicio
                </Link>
                <Link
                    to="/admin/dashboard"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out"
                >
                    Ir al Dashboard
                </Link>
            </div>
        </div>
    );
}