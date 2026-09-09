import './App.css'
import { useEffect, useState } from "react";
import { checkHealth } from "./services/api";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ClientsPage from "./pages/ClientsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

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
            <div>
            <h1>Pulpit</h1>

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
    );
}

function App() {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={
                <ProtectedRoute>
                    <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                            <HomePage />
                        </main>
                    </div>
                </ProtectedRoute>
            } />
            <Route path='/clients' element={
                <ProtectedRoute>
                    <div className="app-layout">
                        <Navbar />
                        <main className="main-content">
                            <ClientsPage />
                        </main>
                    </div>
                </ProtectedRoute>
            } />
        </Routes>
    )
}

export default App;