import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <div className="sidebar-navbar">
            <div className="sidebar-user-text">
                Zalogowano jako: <br />
                <label className="sidebar-user-email">{user?.email}</label>
                <br /> ({user?.role})
            </div>

            <nav className="sidebar-nav-links">
                <Link to="/" className="btn btn-secondary">Pulpit</Link>
                <Link to="/clients" className="btn btn-secondary">Klienci</Link>
            </nav>
            <button 
                className="btn btn-secondary" 
                onClick={logout}
                style={{ marginTop: "auto" }} 
            >
                Wyloguj się
            </button>
        </div>
    );
}

export default Navbar;