import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return <p>Ładowanie...</p>
    }
    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;