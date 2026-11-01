import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/api";
import "./DashboardPage.css";
import StatusBadge from "../components/StatusBadge";
import { formatMoney } from "../utils/format";

function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDashboard()
            .then(setStats)
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div className="message message-error">{error}</div>;
    if (!stats) return <p>Ładowanie...</p>;

    return (
        <div className="dash">
            <h1>Pulpit</h1>
            <div className="dash-cards">
                <Link to="/orders" className="dash-card dash-card-accent">
                    <span className="dash-card-label">Aktywne zlecenia</span>
                    <span className="dash-card-value">{stats.active_orders}</span>
                </Link>
                <Link to="/orders" className="dash-card">
                    <span className="dash-card-label">Zakończone zlecenia</span>
                    <span className="dash-card-value">{stats.completed_orders}</span>
                </Link>
                <Link to="/clients" className="dash-card">
                    <span className="dash-card-label">Klienci</span>
                    <span className="dash-card-value">{stats.clients_count}</span>
                </Link>
                <Link to="/cars" className="dash-card">
                    <span className="dash-card-label">Pojazdy</span>
                    <span className="dash-card-value">{stats.cars_count}</span>
                </Link>
                <div className="dash-card">
                    <span className="dash-card-label">Przychód (zakończone)</span>
                    <span className="dash-card-value">{formatMoney(stats.revenue)}</span>
                </div>
            </div>

            <div className="dash-section-header">
                <h2>Bieżące zlecenia</h2>
                <Link to="/orders" className="dash-link">Wszystkie zlecenia: </Link>
            </div>
             {stats.recent_orders.length === 0 ? (
                <p className="empty-state">Brak aktywnych zleceń.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Pojazd</th>
                                <th>Klient</th>
                                <th>Opis</th>
                                <th>Status</th>
                                <th>Koszt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.car_name}</td>
                                    <td>{order.client_name}</td>
                                    <td>{order.description}</td>
                                    <td><StatusBadge status={order.status} /></td>
                                    <td className="text-nowrap">{formatMoney(order.total_cost)}</td>
                                </tr>
    ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;