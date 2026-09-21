import { useEffect, useState } from "react";
import { getCars, createCar, getClients } from "../services/api";
import "./CarsPage.css";

function CarsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [clients, setClients] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        registration_number: "",
        mileage: "",
        body_type: "",
        production_year: "",
        owner_id: "",
    });

    const [formError, setFormError] = useState(null);

    async function loadCars() {
        try {
            setLoading(true);
            setError(null);
            const data = await getCars();
            setCars(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadClients() {
        try {
            const data = await getClients();
            setClients(data);
        } catch(err) {
            console.error("Nie udało się pobrać klientów:", err.message);
        }
    }

    useEffect(() => {
        loadCars();
        loadClients();
    }, []);

    function handleChange(e) {
        const {name , value} = e.target;
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);

        try {
            const payload = {
                ...formData,
                mileage: Number(formData.mileage),
                production_year: Number(formData.production_year),
                owner_id: Number(formData.owner_id),
            };

            await createCar(payload);

            setFormData({
                brand: "", model: "", registration_number: "",
                mileage: "", body_type: "", production_year: "", owner_id: "",
            });
            setShowForm(false);
            await loadCars();
        } catch (err) {
            setFormError(err.message);
        }
    }

    return (
        <div className="page">
            <div className="page-content">
                <div className="top-bar">
                    <h1>Pojazdy</h1>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        Nowy Pojazd
                    </button>
                </div>

                {showForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="top-bar">
                                <h2>Dodaj pojazd</h2>
                                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>X</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="field">
                                    <label>Marka</label>
                                    <input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                            <div className="field">
                                    <label>Model</label>
                                    <input
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                            <div className="field">
                                    <label>Numer rejestracyjny</label>
                                    <input
                                    name="registration_number"
                                    value={formData.registration_number}
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                            <div className="field">
                                    <label>Przebieg</label>
                                    <input
                                    name="mileage"
                                    value={formData.mileage}
                                    onChange={handleChange}
                                    required min="0"
                                    />
                                </div>
                            <div className="field">
                                    <label>Typ nadwozia</label>
                                    <input
                                    name="body_type"
                                    value={formData.body_type}
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                            <div className="field">
                                    <label>Rok produkcji</label>
                                    <input
                                    type="number"
                                    name="production_year"
                                    value={formData.production_year}
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                            <div className="field">
                                <label>Właściciel</label>
                                <select
                                name="owner_id" 
                                value={formData.owner_id}
                                onChange={handleChange}
                                required
                                >
                                    <option value="">-- wybierz klienta --</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                           {formError && <div className="message message-error">{formError}</div>}

                           <div>
                            <button type="submit" className="btn btn-primary">Zapisz pojazd</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Anuluj</button>
                            </div>             
                            
                            </form>

                        </div>
                    </div>
                )}

                {loading && <p>Ładowanie...</p>}
                {error && <div className="message message-error">{error}</div>}
                {!loading && !error && cars.length === 0 && <p>Brak pojazdów w bazie.</p>}

                {!loading && cars.length > 0 && (
                     <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Marka i model</th>
                                    <th>Rok produkcji</th>
                                    <th>Przebieg</th>
                                    <th>Numer rejestracyjny</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car) => (
                                    <tr key={car.id}>
                                        <td>{car.brand} {car.model}</td>
                                        <td>{car.production_year}</td>
                                        <td>{car.mileage}</td>
                                        <td>{car.registration_number}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    )

}

export default CarsPage;