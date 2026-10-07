import { useEffect, useState } from "react";
import { getOrders, createOrder, updateOrder, getCars } from "../services/api";

const ORDER_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cars, setCars] = useState([])
    const [showForm, setShowForm] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [editingOrderId, setEditingOrderId] = useState(null);

    const [formData, setFormData] = useState({
        description: "",
        status: "PENDING",
        total_cost: "",
        car_id: "",
    });
    const [formError, setFormError] = useState(null);

    async function loadOrders() {
        try {
            setLoading(true);
            setError(null);
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadCars() {
        try {
            const data = await getCars();
            setCars(data);
        } catch (err) {
            console.error("Nie udało się pobrać pojazdów:", err.message);
        }
    }

    useEffect(() => {
        loadOrders();
        loadCars();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    function handleOpenCreateForm() {
        setEditingOrderId(null);
        setFormData({ description: "", status: "PENDING", total_cost: "", car_id: "" });
        setFormError(null);
        setShowForm(true);
    }

    function handleOpenEditForm(order) {
        setEditingOrderId(order.id);
        setFormData({
            description: order.description,
            status: order.status,
            total_cost: order.total_cost,
            car_id: order.car_id,
        });
        setFormError(null);
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);
        setSuccessMessage(null);

        try {
            const payload = {
                ...formData,
                total_cost: Number(formData.total_cost),
                car_id: Number(formData.car_id),
            };

            if (editingOrderId) {
                await updateOrder(editingOrderId, payload);
                setSuccessMessage("Zaktualizowane zlecenie.")
            } else {
                await createOrder(payload);
                setSuccessMessage("Dodano nowe zlecenie.")
            }

            setShowForm(false);
            setEditingOrderId(null);
            await loadOrders();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setFormError(err.message);
        }
    }

    return (
        <div className="page">
            <div className="page-content">
                <div className="top-bar">
                    <h1>Zlecenia serwisowe</h1>
                    <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                        Nowe Zlecenie
                    </button>
                </div>

                {successMessage && <div className="message message-success">{successMessage}</div>}

                {showForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="top-bar">
                                <h2>{editingOrderId ? "Edytuj zlecenie" : "Dodaj zlecenie"}</h2>
                                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>X</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="field">
                                    <label>Opis</label>
                                    <input name="description" value={formData.description} onChange={handleChange} required />
                                </div>

                                <div className="field">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} required>
                                        {ORDER_STATUSES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Koszt</label>
                                    <input type="number" name="total_cost" value={formData.total_cost} onChange={handleChange} required min="0" step="0.01" />
                                </div>

                                <div className="field">
                                    <label>Pojazd</label>
                                    <select name="car_id" value={formData.car_id} onChange={handleChange} required>
                                        <option value="">-- wybierz pojazd --</option>
                                        {cars.map((car) => (
                                            <option key={car.id} value={car.id}>
                                                {car.brand} {car.model} ({car.registration_number})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {formError && <div className="message message-error">{formError}</div>}

                                <div>
                                    <button type="submit" className="btn btn-primary">
                                        {editingOrderId ? "Zapisz zmiany" : "Zapisz zlecenie"}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Anuluj</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {loading && <p>Ładowanie...</p>}
                {error && <div className="message message-error">{error}</div>}
                {!loading && !error && orders.length === 0 && <p>Brak zleceń w bazie.</p>}

                {!loading && orders.length > 0 && (
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Opis</th>
                                    <th>Status</th>
                                    <th>Koszt</th>
                                    <th className="text-center">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.description}</td>
                                        <td>{order.status}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>{order.total_cost}&nbsp;zł</td>
                                        <td className="text-center">
                                            <button className="btn btn-secondary" onClick={() => handleOpenEditForm(order)}>
                                                Edytuj
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;