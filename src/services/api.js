const API_URL = "http://localhost:8000";

function getToken() {
    return localStorage.getItem("token");
}

async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {...options, headers});

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Sesja wygasła, zaloguj się ponownie.");
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Błąd żądania");
    }

    return response.status === 204 ? null : response.json();
}

export { apiFetch, getToken }

export async function login(email, password) {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if (!response.ok) throw Error("Niepoprawny email lub hasło");

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return data
}

export async function checkHealth() {
    const response = await fetch(`${API_URL}/api/v1/health`);

    if (!response.ok) {
        throw new Error("Backend nie działa");
    }
    return response.json();
}