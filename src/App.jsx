import './App.css'
import { useEffect, useState } from "react";
import { checkHealth } from "./services/api";

function App() {
    const [health, setHealth] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkHealth()
            .then((data) => setHealth(data))
            .catch((error) => setError(error.message));
    }, []);

    return (
        <div className="container mt-5">
            <h1>Warsztat samochodowy</h1>

            {health && (
                <div className="alert alert-success mt-4">
                    Backend działa 
                    <br />
                    Server: {health.server}
                    <br />
                    Database: {health.database}
                </div>
            )}

            {error && (
                <div className="alert alert-danger mt-4">
                    {error} 
                </div>
            )}
        </div>
    );
}

export default App;