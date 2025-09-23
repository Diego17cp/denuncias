import { BackIcon } from "../../../Components/Icons";
import { Link } from "react-router";
import { Loader } from "../../../Components/Loaders/Loader";
import { useSearchAdmin } from "../../../hooks/Admin/Users/useSearchAdmin";
import { getEstadoColor, getTypeColor } from "../../../utils";
import { SearchAdminLoader } from "../../../Components/Loaders/SearchAdminLoader";
import FormularioAdministrador from "../../../Components/Admin/Usuarios/FormularioAdministrador";

export const SearchAdmin = () => {
    const { 
        dniAdmin, 
        handleDniChange, 
        handleSearch, 
        adminData, 
        loading, 
        error,
        editAction,
        showForm,
        handleEditStart,
        handleEditCancel,
    } = useSearchAdmin();

    return (
        <div className="container mx-auto my-8 px-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 animate__animated animate__fadeIn">
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <span className="text-(--primary-color) mr-2">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <span className="animate__animated animate__fadeIn">
                                Búsqueda de Administradores
                            </span>
                        </h3>
                        <Link
                            to="/admin/users"
                            className="border cursor-pointer border-gray-300 bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <BackIcon />
                            <span>Volver</span>
                        </Link>
                    </div>
                </div>

                <div className="p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Panel informativo */}
                        <div className="mb-8 bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                            <div className="flex items-start">
                                <i className="fas fa-info-circle mt-0.5 mr-2"></i>
                                <p>
                                    Ingrese el DNI del administrador para ver su información detallada. 
                                    Esta búsqueda permite encontrar administradores activos e inactivos.
                                </p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <i className="fas fa-id-card text-gray-400"></i>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-10 py-2.5 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-(--primary-color) focus:border-(--primary-color) transition-all duration-200"
                                        placeholder="Ingrese DNI de administrador"
                                        value={dniAdmin}
                                        onChange={(e) => handleDniChange(e.target.value)}
                                        maxLength={8}
                                    />
                                    {dniAdmin && (
                                        <button
                                            onClick={() => handleDniChange("")}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="disabled:bg-gray-400 disabled:cursor-not-allowed bg-(--secondary-color) cursor-pointer text-white px-6 py-2.5 rounded-md hover:bg-(--primary-color) transition-colors duration-300 ease-in-out flex items-center gap-2 shadow-sm"
                                    disabled={loading || !dniAdmin.trim() || dniAdmin.length !== 8}
                                >
                                    {loading ? (
                                        <Loader isBtn={true} />
                                    ) : (
                                        <>
                                            <i className="fas fa-search"></i>
                                            <span>Buscar</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mostrar error */}
                        {error && (
                            <div className="animate__animated animate__fadeIn bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <div className="flex items-start">
                                    <i className="fas fa-exclamation-circle text-red-500 mt-0.5 mr-2"></i>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}
                        {
                            loading && (
                                <SearchAdminLoader />
                            )
                        }
                        {adminData && !loading && !error && !showForm && (
                            <div className="animate__animated animate__fadeIn">
                                <h4 className="text-lg font-medium text-gray-800 mb-4">
                                    Información del Administrador
                                </h4>
                                
                                <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                            <div className="bg-blue-200 h-24 w-24 rounded-full flex items-center justify-center">
                                                <i className="fas fa-user text-4xl text-(--secondary-color)"></i>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    {adminData.nombres}
                                                </h3>
                                                <p className="text-gray-500 mb-3">
                                                    DNI: {adminData.dni_admin}
                                                </p>
                                                <div className="flex flex-wrap gap-3">
                                                    <span className={`capitalize px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(adminData.categoria)}`}>
                                                        {adminData.categoria.replace("_", " ")}
                                                    </span>
                                                    <span className={`capitalize px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(adminData.estado)}`}>
                                                        {adminData.estado}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                Acciones disponibles
                                            </h5>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-3 py-2 rounded flex items-center gap-2 transition-colors duration-200"
                                                    onClick={() => handleEditStart('password')}
                                                >
                                                    <i className="fas fa-key text-sm"></i>
                                                    <span>Cambiar contraseña</span>
                                                </button>
                                                <button
                                                    className={`cursor-pointer px-3 py-2 rounded flex items-center gap-2 transition-colors duration-200 ${
                                                        adminData.estado === 'activo'
                                                            ? 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
                                                            : 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700'
                                                    }`}
                                                    onClick={() => handleEditStart('state')}
                                                >
                                                    <i className={`fas ${adminData.estado === 'activo' ? 'fa-toggle-off' : 'fa-toggle-on'} text-sm`}></i>
                                                    <span>{adminData.estado === 'activo' ? 'Desactivar' : 'Activar'}</span>
                                                </button>
                                                <button
                                                    className="cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 px-3 py-2 rounded flex items-center gap-2 transition-colors duration-200"
                                                    onClick={() => handleEditStart('role')}
                                                >
                                                    <i className="fas fa-tags text-sm"></i>
                                                    <span>Cambiar categoría</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showForm && editAction && adminData && (
                            <div className="animate__animated animate__fadeIn mt-4">
                                <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                                    <div className="p-4">
                                        <h4 className="text-lg font-medium text-gray-800 mb-4">
                                            {editAction === 'password' ? 'Cambiar Contraseña' : 
                                            editAction === 'state' ? (adminData.estado === 'activo' ? 'Desactivar Cuenta' : 'Activar Cuenta') : 
                                            'Cambiar Categoría'}
                                        </h4>
                                        
                                        <FormularioAdministrador 
                                            admin={adminData}
                                            actionType={editAction}
                                            onCancel={handleEditCancel}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {!adminData && !loading && !error && (
                            <div className="text-center py-16 bg-gray-50 rounded-lg">
                                <div className="text-5xl text-gray-300 mb-3">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-1">
                                    Busque un administrador
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Ingrese el DNI completo (8 dígitos) para ver su información
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SearchAdmin;