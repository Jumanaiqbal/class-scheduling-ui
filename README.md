# Class Scheduling UI

A modern React dashboard for managing driving school class schedules, instructors, students, and reports.

## Features

- Dashboard with live stats and charts
- CSV upload for bulk scheduling
- Configurable system settings
- Reports and analytics
- Responsive Material-UI design
- Routing for dashboard, upload, reports, and config

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Backend API running at `http://localhost:5001` (see proxy setup)

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/Jumanaiqbal/class-scheduling-ui.git
cd class-scheduling-ui
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure API Proxy

The frontend expects the backend API at `http://localhost:5001`. The proxy is set in `package.json`:

```json
"proxy": "http://localhost:5001"
```

If your backend runs elsewhere, update this value.

### 4. Start the development server

```sh
npm start
```

- The app runs at `http://localhost:3000`
- API requests are proxied to the backend

### 5. Available Pages

- `/` — Dashboard (stats, charts, quick actions)
- `/upload` — CSV upload for class schedules
- `/reports` — View and filter class reports
- `/config` — System configuration (settings)

## Project Structure

```
public/
	index.html, favicon.ico, ...
src/
	components/
		dashboard/      # StatsChart, cards, dashboard UI
		config/         # ConfigForm, config UI
		reports/        # ReportTable, filters
		upload/         # CSVUploader, upload results
		common/         # Layout, Navigation, Loading
	contexts/         # AppContext
	hooks/            # useApi, useNotification
	pages/            # Dashboard, Upload, Reports, Config
	services/         # api.js, axiosConfig.js
	themes/           # MUI theme, palette
	utils/            # constants, helpers
	App.js, index.js, ...
```

## Environment Variables

- By default, uses the proxy in `package.json`.
- For custom API URLs, set `REACT_APP_API_BASE_URL` in a `.env` file.

## Backend API

- Ensure the backend is running and accessible at the proxy URL.
- Endpoints used:
  - `/api/dashboard/summary` — Dashboard summary stats
  - `/api/dashboard/stats?days=30` — Chart stats
  - `/api/registrations/upload` — CSV upload
  - `/api/reports/classes` — Reports
  - `/api/config` — System config

## Customization

- Update theme in `src/themes/`
- Add new pages/components in `src/pages/` and `src/components/`
- Extend API helpers in `src/services/api.js`

## Scripts

- `npm start` — Start development server
- `npm run build` — Build for production
- `npm test` — Run tests (if available)

## Troubleshooting

- **API errors:** Check backend is running and proxy is correct.
- **CORS issues:** Use the proxy or configure CORS on backend.
- **Port conflicts:** Change frontend or backend port in config.

## License

MIT

## Author

Jumanaiqbal
