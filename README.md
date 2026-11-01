# Warsztat — system zarządzania warsztatem samochodowym

<sub>Projekt w trakcie rozwoju</sub>

Aplikacja webowa służąca do zarządzania warsztatem samochodowym. Umożliwia prowadzenie ewidencji klientów, pojazdów oraz zleceń serwisowych, a także monitorowanie bieżącej działalności warsztatu za pomocą panelu głównego.

Projekt składa się z dwóch części:
- **Frontend** — aplikacja webowa zbudowana w React.
- **Backend** — REST API stworzone przy użyciu FastAPI, odpowiedzialne za logikę biznesową, autoryzację i komunikację z bazą danych.

## Zrzuty ekranu

### Logowanie
![Ekran logowania](docs/screenshots/logowanie.png)

### Pulpit
![Panel główny](docs/screenshots/pulpit.png)

### Klienci
![Lista klientów](docs/screenshots/klienci.png)

### Pojazdy
![Lista pojazdów](docs/screenshots/pojazdy.png)

### Zlecenia serwisowe
![Lista zleceń](docs/screenshots/zlecenia.png)

## Funkcjonalności

### Użytkownicy i autoryzacja
- Rejestracja i logowanie użytkowników.
- Uwierzytelnianie z wykorzystaniem tokenów JWT.
- Obsługa ról użytkowników: `ADMIN` oraz `MECHANIC`.
- Kontrola dostępu do wybranych operacji.
- Automatyczna obsługa wygasłej sesji.

### Panel główny
- Podsumowanie liczby klientów i pojazdów.
- Liczba aktywnych i zakończonych zleceń.
- Podgląd przychodu z zakończonych zleceń.
- Lista ostatnich aktywnych zleceń.

### Zarządzanie klientami
- Dodawanie klientów.
- Wyszukiwanie po imieniu, nazwisku, adresie e-mail i numerze telefonu.
- Podgląd szczegółów klienta.
- Wyświetlanie liczby przypisanych pojazdów.
- Usuwanie klientów z uwzględnieniem uprawnień.

### Zarządzanie pojazdami
- Dodawanie pojazdów.
- Edycja danych pojazdu.
- Wyszukiwanie po marce, modelu i numerze rejestracyjnym.
- Przypisywanie pojazdów do klientów.
- Usuwanie pojazdów z uwzględnieniem uprawnień.

### Zlecenia serwisowe
- Tworzenie zleceń serwisowych.
- Edycja istniejących zleceń.
- Wyszukiwanie zleceń po opisie.
- Obsługa statusów:
  - `PENDING` — oczekujące,
  - `IN_PROGRESS` — w realizacji,
  - `COMPLETED` — zakończone,
  - `CANCELLED` — anulowane.
- Przypisywanie zleceń do pojazdów.
- Ewidencja kosztów usług.

### Dodatkowe rozwiązania
- Paginacja list danych.
- Opóźnianie wyszukiwania za pomocą własnego hooka `useDebounce`.
- Wspólne komponenty interfejsu, m.in. `Pagination` i `StatusBadge`.
- Centralna obsługa komunikacji z API.
- Formatowanie kwot i statusów.

## Technologie

### Frontend
- React
- JavaScript
- React Router
- Vite
- Bootstrap
- CSS

### Backend
- Python
- FastAPI
- PostgreSQL
- SQLAlchemy 2.0 (async)
- Pydantic
- JWT
- bcrypt
- Docker Compose

## Struktura projektu

Projekt jest podzielony na dwa osobne repozytoria:

```text
warsztat/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── utils/
├── docs/
│   └── screenshots/
├── public/
├── package.json
└── README.md
```

Backend znajduje się w osobnym repozytorium:

[Warsztat API — GitHub](https://github.com/kulikowski271-lgtm/warsztat-api)

## Uruchomienie projektu lokalnie

Do uruchomienia aplikacji potrzebne są:
- Python 3.11 lub nowszy,
- Node.js i npm,
- Docker z Docker Compose,
- PostgreSQL (uruchamiany w kontenerze Docker).

### 1. Backend

Sklonuj repozytorium backendu:

```bash
git clone https://github.com/kulikowski271-lgtm/warsztat-api.git
cd warsztat-api
```

Utwórz i aktywuj środowisko wirtualne:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Zainstaluj zależności:

```bash
pip install -r requirements.txt
```

Utwórz plik `.env` na podstawie `.env.example`:

```bash
copy .env.example .env
```

Uzupełnij dane połączenia z bazą PostgreSQL oraz konfigurację JWT.

Przykładowe zmienne środowiskowe:

```env
SECRET_KEY=twoj_tajny_klucz
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

DB_USER=uzytkownik_bazy
DB_PASSWORD=haslo
DB_HOST=localhost
DB_PORT=5432
DB_NAME=warsztat

DATABASE_URL=postgresql+psycopg://uzytkownik_bazy:haslo@localhost:5432/warsztat
```

Uruchom bazę danych:

```bash
docker compose up -d
```

Uruchom serwer API:

```bash
uvicorn main:app --reload
```

Backend będzie dostępny pod adresem:

`http://127.0.0.1:8000`

Dokumentacja API (Swagger UI):

`http://127.0.0.1:8000/docs`

### 2. Frontend

Sklonuj repozytorium frontendu w osobnym katalogu:

```bash
git clone https://github.com/kulikowski271-lgtm/warsztat.git
cd warsztat
```

Zainstaluj zależności:

```bash
npm install
```

Uruchom serwer deweloperski:

```bash
npm run dev
```

Frontend będzie dostępny pod adresem wyświetlonym w terminalu przez Vite (domyślnie `http://localhost:5173`).

**Uwaga:** backend powinien być uruchomiony równolegle z frontendem. Aktualna konfiguracja frontendu korzysta z API pod adresem `http://localhost:8000`.

## Status projektu

Projekt jest nadal rozwijany. Obecna wersja obejmuje podstawowe moduły zarządzania warsztatem, uwierzytelnianie użytkowników oraz komunikację między frontendem i backendem.

W planach dalszego rozwoju znajdują się m.in.:
- Rozbudowa istniejących funkcjonalności.
- Dalsze usprawnienia interfejsu użytkownika.
- Poprawa walidacji i obsługi błędów.

--- 