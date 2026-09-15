import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClients } from "../services/api";
import "./ClientDetailPage.css";

function ClientDetailPage() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getClients()
            .then((data) => {
                const found = data.find((c) => c.id === parseInt(id));
                if (found) {
                    setClient(found);
                } else {
                    setError("Nie znaleziono takiego klienta.");
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="page">
                <div className="page-content">
                    <p>Ładowanie...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="page-content">
                    <div className="message message-error">{error}</div>
                </div>
            </div>
        );
    }

    if (!client) return null;

return (
        <div className="page client-detail-page"> 
            <div className="page-content">
                <div className="top-bar">
                    <h1>{client.first_name} {client.last_name}</h1>
                    <Link to="/clients" className="btn btn-secondary">
                        Powrót
                    </Link>
                </div>
                
                <div className="card contact-card">
                    <h2>Dane kontaktowe</h2>
                <div className="contact-grid">
                <div>
                    <span className="contact-item-label">Email</span>
                    <span className="contact-item-value">{client.email}</span>
                </div>
                <div>
                    <span className="contact-item-label">Telefon</span>
                    <span className="contact-item-value">{client.phone}</span>
                </div>
                </div>
                </div>
                <div className="vehicles-header">
                    <h2>Pojazdy klienta</h2>
                    <button className="btn btn-primary">+ Dodaj pojazd</button>
                </div>

                {client.cars.length === 0 ? (
                    <p className="empty-state">Ten klient nie ma jeszcze przypisanych pojazdów</p>
                ) : (
                    <table className="table">
                    <thead>
                        <tr>
                            <th>Marka i model</th>
                            <th>Rok produkcji</th>
                            <th>Przebieg</th>
                            <th>Typ nadwozia</th>
                            <th>Numer rejestracyjny</th>
                        </tr>
                    </thead>
                    <tbody>
                        {client.cars.map((car, index) => (
                            <tr key={car.id || index}>
                                <td>{car.brand} {car.model}</td>
                                <td>{car.production_year}</td>
                                <td>{car.mileage}</td>
                                <td>{car.body_type}</td>
                                <td>{car.registration_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
}

export default ClientDetailPage;