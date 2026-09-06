import { createContext, useContext, useState, useEffect } from "react";
import { login as loginRequest, getToken, apiFetch } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider( {children }) {
    const [user, setUser] = useState(true);
    const [loading, setLoading] = useState(true);


useEffect(() => {
    const token = getToken();

    if (!token) {
        setLoading(false);
        return;
    }
    apiFetch("/users/me")
        .then((data) => setUser(data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
}, []);

    async function login(email, password) {
        await loginRequest(email, password);
        const currentUser = await apiFetch("/users/me");
        setUser(currentUser);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null)
    }

    const value = {user, loading, login, logout};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
