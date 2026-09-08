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
    <div className="container mt-5">
        <h1>Logowanie</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Hasło</label>
                <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary">
                Zaloguj się
            </button>

        </form>
    </div>
);
   
}

export default LoginPage;



