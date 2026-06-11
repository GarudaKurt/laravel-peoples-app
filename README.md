# Laravel Peoples App

A full-stack people management application built with **Laravel 13**, **Inertia.js**, **React**, and **PostgreSQL**. Supports creating, editing, deleting, and searching people via a clean UI with a REST API backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.3 |
| Frontend | React 18, TypeScript, Inertia.js |
| Database | PostgreSQL 17 |
| Styling | Tailwind CSS, shadcn/ui |
| Build Tool | Vite |
| Package Manager | pnpm |

---

## Requirements

Before getting started, make sure you have the following installed:

- **PHP** 8.3+
- **Composer** 2.x
- **Node.js** 18+
- **pnpm** 8+ — install via `npm install -g pnpm`
- **PostgreSQL** 17 (with pgAdmin 4 recommended for GUI management)
- **Git**

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/GarudaKurt/laravel-peoples-app.git
cd laravel-peoples-app
```

### 2. Install PHP dependencies

```bash
composer install
```

> If you encounter a Symfony version error, run `composer update` to resolve package compatibility.

### 3. Install Node dependencies

```bash
pnpm install
```

### 4. Set up environment variables

```bash
cp .env.example .env
php artisan key:generate
```

Then open `.env` and update the database section:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=peoples_app
DB_USERNAME=postgres
DB_PASSWORD=your_postgresql_password
```

> **Note:** If your PostgreSQL is running on a non-default port (e.g. installed alongside another PostgreSQL version), it may be on port `5433`. Check pgAdmin to confirm.

### 5. Create the database

Open **pgAdmin 4**, connect to your PostgreSQL server, then:

1. Right-click **Databases** → **Create** → **Database**
2. Enter `peoples_app` as the name
3. Click **Save**

### 6. Run migrations

```bash
php artisan migrate
```

This creates the `people`, `sessions`, `cache`, and other required tables.

---

## Running the App

You need **two terminals** running simultaneously:

**Terminal 1 — Laravel backend:**
```bash
php artisan serve
```

**Terminal 2 — Vite frontend:**
```bash
pnpm run dev
```

Then visit: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## REST API

Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/people` | List all people |
| `POST` | `/people` | Create a new person |
| `PUT` | `/people/{id}` | Update a person |
| `DELETE` | `/people/{id}` | Delete a person |

### Request headers

All requests should include:
```
Accept: application/json
Content-Type: application/json
```

### Example payloads

**POST /api/people**
```json
{
    "first_name": "Juan",
    "last_name": "dela Cruz"
}
```

**PUT /api/people/1**
```json
{
    "first_name": "Maria",
    "last_name": "Santos"
}
```

### Example responses

**GET /api/people** — `200 OK`
```json
[
    { "id": 1, "first_name": "Juan", "last_name": "dela Cruz", "created_at": "...", "updated_at": "..." }
]
```

**POST /api/people** — `201 Created`
```json
{ "id": 2, "first_name": "Maria", "last_name": "Santos", "created_at": "...", "updated_at": "..." }
```

**DELETE /api/people/1** — `204 No Content`

---

## Testing the API with Postman

1. Open Postman and create a new request
2. Set the URL to `http://127.0.0.1:8000/api/people`
3. Under the **Headers** tab, add:
   - `Accept` → `application/json`
   - `Content-Type` → `application/json`
4. For POST and PUT, go to **Body** → **raw** → **JSON** and paste your payload
5. Click **Send**

---

## Common Issues

**Symfony version conflict on `composer install`**

Run `composer update` to downgrade Symfony packages to versions compatible with PHP 8.3.

**`zip` extension missing (Composer warning)**

Open your `php.ini` (path shown in the Composer warning) and uncomment:
```ini
extension=zip
```

**PostgreSQL connection refused**

- Make sure PostgreSQL is running (check pgAdmin or Windows Services)
- Verify `DB_PORT` in `.env` matches what pgAdmin shows (usually `5432` or `5433`)
- Confirm the password is correct by connecting via pgAdmin first

**`sessions` table not found**

Run `php artisan migrate` — the sessions table is created by migration.

**Vite manifest error (`Unable to locate file in Vite manifest`)**

Make sure `pnpm run dev` is running in a second terminal alongside `php artisan serve`.

---

## Project Structure

```
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           └── PersonController.php   # REST API controller
│   └── Models/
│       └── Person.php                     # People model
├── database/
│   └── migrations/
│       └── ..._create_people_table.php    # People table migration
├── resources/
│   └── js/
│       └── pages/
│           └── PeoplePage.tsx             # React frontend page
├── routes/
│   ├── api.php                            # API routes
│   └── web.php                            # Web routes
└── .env                                   # Environment configuration
```

---

## License

This project is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).
