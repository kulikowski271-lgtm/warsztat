import './App.css'
import { useEffect, useState } from "react";
import { checkHealth } from "./services/api";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ClientsPage from "./pages/ClientsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from './context/AuthContext';

function HomePage() {
    const [health, setHealth] = useState(null);
    const [error, setError] = useState(null);

    const { user, logout } = useAuth();

    useEffect(() => {
        checkHealth()
            .then((data) => setHealth(data))
            .catch((error) => setError(error.message));
    }, []);

    return (
    <div className="page">
        <div className="page-content">
            <div className="top-bar">

            <h1>Warsztat samochodowy</h1>

            <Link to="/clients" className="btn btn-secondary ml-sm">Klienci</Link>

    {user && (
    <div className="user-info">
    Zalogowano jako:
     <span className="user-email">{user.email}</span> ({user.role})
    <button className="btn btn-secondary ml-sm" onClick={logout}>
    Wyloguj się
     </button>
        </div>
    )}
</div>

    {health && (
    <div className="message message-success">
        Backend działa
        <br />
        Server: {health.server}
        <br />
        Database: {health.database}
    </div>
)}

{error && (
    <div className="message message-error">
        {error}
    </div>
)}
 </div>
    </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path='/clients' element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
        </Routes>
    )
}

export default App;