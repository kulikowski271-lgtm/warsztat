import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClients, createCar, deleteCar, getOrders } from "../services/api";
import "./ClientDetailPage.css";

function ClientDetailPage() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("cars");
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
            setLoading(true);
            setError(null);

            const clientsData = await getClients();
            const ordersData = await getOrders();

            const foundClient = clientsData.find((c) => c.id === parseInt(id));

            if (foundClient) {
                setClient(foundClient);

                const clientCarIds = foundClient.cars ? foundClient.cars.map((car) => car.id) : [];

                const clientOrders = ordersData.filter((order) =>
                    clientCarIds.includes(order.car_id)
                );

                setOrders(clientOrders);
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

            await createCar(payload);

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
            setCarFormError(err.message);
        }
    }

    async function handleDeleteCar(carId) {
        if (!window.confirm("Czy na pewno chcesz usunąć ten pojazd?")) return;

        try {
            await deleteCar(carId);
            await fetchClientData();
        } catch (err) {
            setError(err.message);
        }
    }

    // POPRAWKA: zmieniono client.car na client.cars
    function getCarName(carId) {
        if (!client || !client.cars) return `Pojazd #${carId}`;
        const foundCar = client.cars.find((c) => c.id === carId);
        return foundCar
            ? `${foundCar.brand} ${foundCar.model} (${foundCar.registration_number})`
            : `Pojazd #${carId}`;
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

                <div className="tabs-container">
                    <button
                        className={`tab-button ${activeTab === "cars" ? "active" : ""}`}
                        onClick={() => setActiveTab("cars")}
                    >
                        Pojazdy ({client.cars ? client.cars.length : 0})
                    </button>
                    <button
                        className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        Zlecenia serwisowe ({orders.length})
                    </button>
                </div>

                {/* ZAKŁADKA 1: POJAZDY */}
                {activeTab === "cars" && (
                    <div className="tab-content">
                        <div className="vehicles-header">
                            <h2>Pojazdy klienta</h2>
                            <button className="btn btn-primary" onClick={() => setShowCarForm(true)}>
                                Dodaj pojazd
                            </button>
                        </div>

                        {!client.cars || client.cars.length === 0 ? (
                            <p className="empty-state">Ten klient nie ma jeszcze przypisanych pojazdów.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Marka i model</th>
                                        <th>Rok produkcji</th>
                                        <th>Przebieg</th>
                                        <th>Typ nadwozia</th>
                                        <th>Numer rejestracyjny</th>
                                        <th>Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {client.cars.map((car) => (
                                        <tr key={car.id}>
                                            <td>{car.brand} {car.model}</td>
                                            <td>{car.production_year}</td>
                                            <td>{car.mileage} km</td>
                                            <td>{car.body_type}</td>
                                            <td>{car.registration_number}</td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ color: "#d9534f", borderColor: "#d9534f" }}
                                                    onClick={() => handleDeleteCar(car.id)}
                                                >
                                                    Usuń
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ZAKŁADKA 2: ZLECENIA SERWISOWE */}
                {activeTab === "orders" && (
                    <div className="tab-content">
                        <div className="vehicles-header">
                            <h2>Zlecenia klienta</h2>
                        </div>

                        {orders.length === 0 ? (
                            <p className="empty-state">Brak zleceń serwisowych dla pojazdów tego klienta.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Pojazd</th>
                                        <th>Opis usterki / naprawy</th>
                                        <th>Status</th>
                                        <th>Koszt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <strong>{getCarName(order.car_id)}</strong>
                                            </td>
                                            <td>{order.description}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="text-nowrap">{order.total_cost}&nbsp;zł</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* MODAL DODAWANIA POJAZDU */}
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
            </div>
        </div>
    );
}

export default ClientDetailPage;