# 📊 Near Miss Incident Dashboard

> An enterprise-grade full-stack application for tracking, analyzing, and visualizing construction site "near miss" incidents.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://multiplied-ai-assignment-pulkit-sin.vercel.app/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blueviolet?style=flat-square&logo=prisma)](https://prisma.io/)

![Dashboard Preview](./docs/dashboard-preview.png)

## � Project Overview

This analytics dashboard provides safety officers and site managers with a powerful tool to monitor "Near Miss" incidents. It transitions from traditional spreadsheet tracking to a dynamic, visual, and interactive platform.

The system is built to handle thousands of records with high performance, offering real-time filtering, aggregation, and visualization of safety data across multiple dimensions (Severity, Region, Action Cause, etc.).

## ✨ Key Features

### 🖥️ Frontend (Client-Side)
*   **Dynamic Analytics Dashboard**:
    *   **Severity Distribution**: Interactive Donut chart displaying the proportion of incidents by severity level.
    *   **Regional Analysis**: Geographic breakdown of incidents using a Donut visualization.
    *   **Monthly Trends**: Area chart with data zooming capabilities to analyze incident frequency over time.
    *   **Action Cause Analysis**: Complex stacked bar chart correlating root causes with behavior types (Safe vs. At-Risk), filterable by region and year.
    *   **Categorical Insights**: Detailed bar charts for Primary Categories, Job/Project types, and specific Locations.
*   **Advanced Dynamic Filtering**:
    *   A robust two-step filtering system allows users to first select *any* data attribute (e.g., "Company Type", "Job") and then dynamically fetch and select from available values for that specific attribute.
*   **Incident Management (CRUD)**:
    *   Full interface to **Create**, **Read**, **Update**, and **Delete** incident records.
    *   Form validation and modal-based editing workflows.
*   **Responsive & Polished UI**:
    *   Glassmorphism design elements.
    *   Fully responsive layout for Desktop, Tablet, and Mobile.
    *   Professional color palettes and typography.

### ⚙️ Backend (Server-Side)
*   **RESTful API Services**:
    *   Built with **NestJS** for a modular, scalable architecture.
    *   **Prisma ORM** for type-safe database interactions.
*   **Advanced Aggregation**:
    *   Dedicated endpoints for complex statistical queries (grouping, counting, filtering) optimized for chart rendering.
*   **Robust Data Handling**:
    *   Global Validation Pipes for DTOs.
    *   CORS configuration for secure cross-origin requests.
    *   Health check endpoints for monitoring.

## 🏗️ Technical Architecture

### Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend** | React 18 | Component-based UI library |
| | TypeScript | Strong typing for reliability |
| | Vite | Next-generation frontend tooling |
| | Apache ECharts | Enterprise-level data visualization |
| | Axios | Promise-based HTTP client |
| | CSS Modules | Scoped component styling |
| **Backend** | NestJS | Progressive Node.js framework |
| | TypeScript | Server-side type safety |
| | Prisma | Modern database ORM |
| | PostgreSQL | Relational database (via Supabase) |
| **DevOps** | Vercel | Frontend hosting |
| | Render/Cloud | Backend hosting |

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   npm or yarn
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/sinha004/Multiplied-AI-Assignment-Pulkit-Sinha-.git
cd Multiplied-AI-Assignment-Pulkit-Sinha-
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Environment Configuration
# Create a .env file and add your database credentials
# DATABASE_URL="postgresql://user:password@host:port/db"

# Database Setup
npx prisma generate   # Generate Prisma Client
npx prisma db push    # Push schema to database
npx prisma db seed    # Seed database with initial data

# Start Server
npm run start:dev
```
*The backend will start at `http://localhost:3000`*

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Environment Configuration
# Create a .env file (optional if backend is local)
# VITE_API_URL="http://localhost:3000/api"

# Start Development Server
npm run dev
```
*The frontend will start at `http://localhost:5173`*

## 🔌 API Documentation

### Core Endpoints

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/incidents` | Retrieve paginated list of incidents with optional filters. |
| `POST` | `/api/incidents` | Create a new incident record. |
| `GET` | `/api/incidents/:id` | Retrieve a specific incident by ID. |
| `PUT` | `/api/incidents/:id` | Update an existing incident. |
| `DELETE` | `/api/incidents/:id` | Remove an incident record. |
| `GET` | `/health` | Check API system health status. |

### Analytics Endpoints

| Endpoint | Purpose |
|:---------|:--------|
| `/stats/summary` | High-level KPIs (Total incidents, LCV counts). |
| `/stats/by-severity` | Data for severity distribution donut chart. |
| `/stats/by-region` | Data with formatted labels for regional analysis. |
| `/stats/by-month` | Time-series data for trend analysis. |
| `/stats/by-action-cause-details` | Complex dataset for Action Cause interactions. |
| `/attributes/:field` | Dynamic distinct values for any schema field. |

## �️ Deployment

The application is deployed live:
*   **Frontend**: Hosted on [Vercel](https://vercel.com) for edge-network performance.
*   **Backend**: Hosted on [Render](https://render.com) (or similar) providing the API runtime.
*   **Database**: Managed PostgreSQL instance on [Supabase](https://supabase.com).

To deploy your own instance, verify the environment variables:
*   **Frontend**: Set `VITE_API_URL` to your production backend URL.
*   **Backend**: Set `FRONTEND_URL` to your production frontend URL (for CORS) and `DATABASE_URL` for the connection.

---

**Developed by Pulkit Sinha for Multiplied AI Assignment**
