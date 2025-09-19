import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/Admin/useAuthContext";
import { Loader } from "./Loaders/Loader";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	allowedRoles,
}) => {
	const { isAuthenticated, loading, user } = useAuthContext();
	const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            if (user.estado !== '1') {
                toast.error('Tu cuenta está inactiva. Por favor contacta al administrador.');
                navigate('/admin/login', { replace: true });
            }
        }
    }, [isAuthenticated, loading, user, navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader isBtn={false} />
        </div>
    }
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{from: location}} replace />
    }
    if (allowedRoles && user && !allowedRoles.includes(user.categoria)) {
        return <Navigate to="/unauthorized" replace />
    }
    return <>{children}</>;
};
