import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div className="page">
        <div className="page-content">
            <div className="card">
            <h1>Logowanie</h1>
            <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
                <label>Email</label>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="field">
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

        </form>
            </div>
        </div>
    </div>
);
   
}

export default LoginPage;



