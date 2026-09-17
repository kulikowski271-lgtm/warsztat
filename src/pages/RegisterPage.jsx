import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import "./RegisterPage.css"; 

function RegisterPage() {
    const [email, setEmail] = useState("");      
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Wprowadzone hasła nie są identyczne.");
            return;
        }

        try {
            await registerUser(email, password);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="page register-container">
            <div className="card register-card">
                <h1 className="register-title">Rejestracja</h1>
                {success && (
                    <div className="message success-message">
                        Konto zostało utworzone!
                    </div>
                )}
                {error && (
                    <div className="message message-error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
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
                    <div className="field register-field">
                        <label>Powtórz hasło</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary register-btn">
                        Zarejestruj się
                    </button>
                </form>
                <div className="register-footer">
                    Masz już konto? <Link to="/login" className="register-link">Zaloguj się</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;