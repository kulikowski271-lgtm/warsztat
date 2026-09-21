import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClients, createCar } from "../services/api";
import "./ClientDetailPage.css";

function ClientDetailPage() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCarForm, setShowCarForm] = useState(false);
    const [carFormData, setCarFormData] = useState({
        brand: "",
        model: "",
        registration_number: "",
        mileage: "",
        body_type: "",
        production_year: "",
    });
    const [carFormError, setCarFormError] = useState(null);

    async function fetchClientData() {
        try {
            const data = await getClients();
            const found = data.find((c) => c.id === parseInt(id));
            if (found) {
                setClient(found);
            } else {
                setError("Nie znaleziono takiego klienta.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleCarChange(e) {
        const { name, value } = e.target;
        setCarFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleCarSubmit(e) {
        e.preventDefault();
        setCarFormError(null);

        try {
            const payload = {
                ...carFormData,
                mileage: Number(carFormData.mileage),
                production_year: Number(carFormData.production_year),
                owner_id: Number(id),
            };

            await createCar(payload)

            setCarFormData({
                brand: "",
                model: "",
                registration_number: "",
                mileage: "",
                body_type: "",
                production_year: "",
            });
            setShowCarForm(false);
            await fetchClientData();
        } catch (err) {
            setCarFormError(err.message)
        }

    }

    useEffect(() => {
        fetchClientData();
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
                    <button className="btn btn-primary" onClick={() => setShowCarForm(true)}>
                        Dodaj pojazd
                    </button>
                </div>

                {showCarForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="top-bar">
                                <h2>Dodaj pojazd</h2>
                                <button className="btn btn-secondary" onClick={() => setShowCarForm(false)}>X</button>
                            </div>

                            <form onSubmit={handleCarSubmit}>
                                <div className="field">
                                    <label>Marka</label>
                                    <input
                                        name="brand"
                                        value={carFormData.brand}
                                        onChange={handleCarChange}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label>Model</label>
                                    <input
                                        name="model"
                                        value={carFormData.model}
                                        onChange={handleCarChange}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label>Numer rejestracyjny</label>
                                    <input
                                        name="registration_number"
                                        value={carFormData.registration_number}
                                        onChange={handleCarChange}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label>Przebieg</label>
                                    <input
                                        type="number"
                                        name="mileage"
                                        value={carFormData.mileage}
                                        onChange={handleCarChange}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="field">
                                    <label>Typ nadwozia</label>
                                    <input
                                        name="body_type"
                                        value={carFormData.body_type}
                                        onChange={handleCarChange}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label>Rok produkcji</label>
                                    <input
                                        type="number"
                                        name="production_year"
                                        value={carFormData.production_year}
                                        onChange={handleCarChange}
                                        required
                                    />
                                </div>

                                {carFormError && <div className="message message-error">{carFormError}</div>}

                                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                                    <button type="submit" className="btn btn-primary">Zapisz pojazd</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCarForm(false)}>Anuluj</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {!client.cars || client.cars.length === 0 ? (
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
                                    <td>{car.mileage} km</td>
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