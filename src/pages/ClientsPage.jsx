import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients, createClient } from "../services/api";

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const [formError, setFormError] = useState(null);

    async function loadClients() {
        try {
            const data = await getClients();
            setClients(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadClients();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);

        try {
            await createClient(formData);
            setFormData({first_name: "", last_name: "", email: "", phone: ""})
            await loadClients();
        } catch(err) {
            setFormError(err.message)
        }
    }

    return (
        <div className="page">
            <div className="page-content">
                <div className="top-bar">
                    <h1>Klienci</h1>
                    <Link to="/" className="btn btn-secondary">
                    Wróć na stronę główną
                    </Link>
                </div>
                <div className="card">
                    <h2>Dodaj klienta</h2>
                    <form onSubmit={handleSubmit}>

                    <div className="field">
                        <label>Imie</label>
                        <input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="field">
                        <label>nazwisko</label>
                        <input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="field">
                        <label>Telefon</label>
                        <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    {formError && <div className="message message-error">{formError}</div>}

                    <button type="submit" className="btn btn-primary">
                        Dodaj klienta
                    </button>
                    </form>
                </div>

                {loading && <p>Ładowanie...</p>}
                {error && <div className="message message-error">{error}</div>}

                {!loading && clients.length === 0 && <p>Brak klientów w bazie.</p>}

                {!loading && clients.length > 0 && (
                    <table className="table">
                    <thead>
                        <tr>
                            <th>Imię i nazwisko</th>
                            <th>Email</th>
                            <th>Telefon</th>
                            <th>Liczba pojazdów</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.first_name} {client.last_name}</td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td>{client.cars.length}</td>
                            </tr>
                         ))}
                    </tbody>
                    </table>
                )}
            </div>
        </div>
    )

}

export default ClientsPage;