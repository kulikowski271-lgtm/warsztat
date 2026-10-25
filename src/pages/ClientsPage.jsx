import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients, createClient, deleteClient } from "../services/api";
import Pagination from "../components/Pagination"; 
import { useDebounce } from "../hooks/useDebounce"; 
import { useAuth } from "../context/AuthContext"; 

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const [formError, setFormError] = useState(null);

    async function loadClients() {
        try {
            setError(null);
            const data = await getClients({
                search: debouncedSearch,
                limit: PAGE_SIZE,
                offset: (page - 1) * PAGE_SIZE,
            });
            if (data.items.length === 0 && page > 1) {
                setPage(page - 1);
                return;
            }
            setClients(data.items);
            setTotal(data.total);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadClients();
    }, [debouncedSearch, page]);


    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    }

    async function handleDelete(clientId) { 
    if (!window.confirm("Czy na pewno chcesz usunąć tego klienta?")) return;

    try {
        await deleteClient(clientId);
        await loadClients();
    } catch (err) {
        window.alert(err.message); 
    }
}

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);

        try {
            await createClient(formData);
            setFormData({first_name: "", last_name: "", email: "", phone: ""})
            setShowForm(false);
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
                    <button 
                    className="btn btn-primary" 
                    onClick={() => setShowForm(true)}
                    >
                    + Nowy klient
                    </button>
                </div>
                <input 
                className="search-input"
                placeholder="Szukaj po imieniu, nazwisku, email, lub telefonie..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                />
                {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="top-bar" style={{ marginBottom: "20px" }}>
                        <h2>Dodaj klienta</h2>
                        <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowForm(false)}
                >
                    X
                </button>
            </div>
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

                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="btn btn-primary">
                        Zapisz klienta
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowForm(false)}
                    >
                        Anuluj
                    </button>
                </div>
            </form>
            </div>
        </div>
)}

                {loading && <p>Ładowanie...</p>}
                {error && <div className="message message-error">{error}</div>}

                {!loading && clients.length === 0 && (
                 <p>{debouncedSearch ? "Brak wyników wyszukiwania." : "Brak klientów w bazie."}</p>
                )}

                {!loading && clients.length > 0 && (
                    <>
                    <table className="table">
                    <thead>
                        <tr>
                            <th>Imię i nazwisko</th>
                            <th>Email</th>
                            <th>Telefon</th>
                            <th>Liczba pojazdów</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>
                                <Link to={`/clients/${client.id}`} className="client-link">
                                {client.first_name} {client.last_name}
                                </Link>
                                </td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td>{client.cars.length}</td>
                                <td>
                                    <div className="actions-wrapper"> 
                                    <Link
                                        to={`/clients/${client.id}`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Szczegóły
                                    </Link>
                                    {isAdmin && ( 
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        style={{ color: "#d9534f", borderColor: "#d9534f", marginLeft: "8px" }}
                                        onClick={() => handleDelete(client.id)}
                                    >
                                        Usuń
                                    </button>
                                    )}
                                </div>
                                </td>
                            </tr>
                         ))}
                    </tbody>
                    </table>
                        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
}

export default ClientsPage;