import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar";

// wspólny układ stron po zalogowaniu: ochrona trasy, menu boczne i miejsce na treść
function Layout() {
    return (
        <ProtectedRoute>
            <div className="app-layout">
                <Navbar />
                <main className="main-content">
                    <Outlet /> {/* tu router wstawia aktualną stronę */}
                </main>
            </div>
        </ProtectedRoute>
    );
}

export default Layout;