# Near Miss Dashboard

An interactive dashboard for analyzing construction near miss incidents. Built with **React.js** (Frontend) and **NestJS** (Backend) using **Supabase PostgreSQL** with **Prisma ORM**.

![Dashboard Preview](./docs/dashboard-preview.png)

## 🚀 Features

- **Interactive Dashboard** with 6 professional charts (Apache ECharts)
- **CRUD Operations** for incident management
- **Advanced Filtering & Pagination** with debounced search
- **Real-time Statistics** - severity, region, GBU, behavior type distributions
- **Monthly Trend Analysis** with multi-year support
- **Responsive Design** - works on desktop, tablet, and mobile

## 📊 Charts Included

1. **Severity Distribution** - Donut chart showing incidents by severity level
2. **Regional Analysis** - Bar chart with gradient colors
3. **Monthly Trends** - Line chart with area fill and data zoom
4. **Action Causes** - Horizontal bar chart for top causes
5. **GBU Distribution** - Bar chart by business unit
6. **Behavior Types** - Rose/pie chart with percentages

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Charts | Apache ECharts |
| Backend | NestJS 11 + TypeScript |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma 5 |
| Styling | Vanilla CSS (Modern Dark Theme) |

## 📋 Prerequisites

- **Node.js** v20.15+ or v22+
- **npm** v10+
- **Supabase Account** (free tier works)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd near-miss-dashboard
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# DATABASE_URL="postgresql://..."
# DIRECT_URL="postgresql://..."

# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init

# Seed database with incidents data
npx prisma db seed

# Start development server
npm run start:dev
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Prisma Studio**: `npx prisma studio` (database viewer)

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
PORT=3000
```

### Frontend (optional .env)

```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── incidents/          # Incidents module (CRUD + stats)
│   │   ├── prisma/             # Prisma service
│   │   └── main.ts             # Entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Data seeding script
│   └── data/
│       └── db.dashboard_incidents.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                # API service layer
│   │   ├── components/
│   │   │   ├── charts/         # 6 ECharts components
│   │   │   ├── cards/          # KPI cards
│   │   │   └── layout/         # Layout components
│   │   ├── pages/              # Dashboard & Incidents pages
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Chart config & formatters
│   └── index.html
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents` | Paginated list with filters |
| GET | `/api/incidents/:id` | Get single incident |
| POST | `/api/incidents` | Create incident |
| PUT | `/api/incidents/:id` | Update incident |
| DELETE | `/api/incidents/:id` | Delete incident |
| GET | `/api/incidents/stats/summary` | KPI summary |
| GET | `/api/incidents/stats/by-severity` | Group by severity |
| GET | `/api/incidents/stats/by-region` | Group by region |
| GET | `/api/incidents/stats/by-month` | Monthly trends |
| GET | `/api/incidents/stats/by-action-cause` | Top causes |
| GET | `/api/incidents/stats/by-gbu` | By GBU |
| GET | `/api/incidents/stats/by-behavior-type` | Behavior distribution |

## 🔍 Query Parameters (Filtering)

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| page | number | `1` | Page number |
| limit | number | `20` | Items per page (max: 100) |
| sortBy | string | `incidentDate` | Sort field |
| sortOrder | string | `desc` | asc or desc |
| search | string | `dropped` | Search text |
| severityLevel | string | `1,2,3` | Comma-separated levels |
| region | string | `Asia` | Region filter |
| gbu | string | `Energy` | GBU filter |
| year | number | `2024` | Year filter |

## 🎨 Design Features

- Modern dark theme with gradient accents
- Glassmorphism effects
- Smooth animations and micro-interactions
- Responsive grid layouts
- Professional color palette
- Custom scrollbars

## 📝 Assumptions & Limitations

1. Dataset is loaded into memory at server startup (~7,800 records)
2. No authentication required for this dashboard
3. Empty string values treated as `null` in database
4. Timestamps in `incident_date` are in milliseconds

## 🧪 Testing

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run build  # Type check during build
```

## 📄 License

MIT License

---

Built with ❤️ for Near Miss Data Analysis
