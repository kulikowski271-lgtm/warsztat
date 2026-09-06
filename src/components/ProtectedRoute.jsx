import { getToken } from "../services/api";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = getToken();

    return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute