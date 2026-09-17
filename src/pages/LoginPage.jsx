import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RegisterPage.css";

function LoginPage() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);

const {login} = useAuth();

const navigate = useNavigate();

async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
        await login(email, password);
        navigate("/");
    } catch (err) {
        setError(err.message);
    }
} 

    return (
    <div className="page register-container">
        <div className="page-content">
            <div className="card register-card">
            <h1 className="register-title">Logowanie</h1>
            <form onSubmit={handleSubmit} className="login-form">
            <div className="field register-field">
                <label>Email</label>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="field register-field">
                <label>Hasło</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            {error && <div className="message message-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block">
                Zaloguj się
            </button>
            <div className="register-footer" style={{ marginTop: "20px" }}>
                Nie masz konta? <Link to="/register" className="register-link">Zarejestruj się</Link>
            </div>

        </form>
            </div>
        </div>
    </div>
);
   
}

export default LoginPage;



