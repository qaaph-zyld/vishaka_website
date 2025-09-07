# 🪐 Vishaka Vedic Astrology Platform

A comprehensive Vedic Astrology platform built with a modern, scalable architecture. This project provides accurate astrological calculations, personalized birth chart generation, and astrological predictions using traditional Vedic principles.

## 🏗️ Architecture Overview

The platform follows a microservices architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Monitoring    │
│   (Next.js)     │    │   (FastAPI)     │    │   (Prometheus/  │
└────────┬────────┘    └────────┬────────┘    │    Grafana)     │
         │                      │             └────────┬────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Calculation   │    │   Logging &     │
│   (Browser)     │    │   Services      │    │   Analytics     │
└─────────────────┘    └────────┬────────┘    └─────────────────┘
                                      │
                                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   Redis Cache   │    │   File Storage  │
│   (PostGIS)     │    │   (Session/     │    │   (MinIO)       │
└─────────────────┘    │    Cache)       │    └─────────────────┘
                       └─────────────────┘
```

## 🚀 Technology Stack

### 🌐 Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible UI components
- **TanStack Query** - Data fetching and caching

### 🔧 Backend
- **FastAPI** - High-performance API framework
- **PostgreSQL** - Primary database with PostGIS
- **Redis** - Caching and session management
- **SQLAlchemy** - ORM for database operations
- **Alembic** - Database migrations

### 📊 Monitoring & Observability
- **Prometheus** - Metrics collection
- **Grafana** - Visualization and dashboards
- **Loki** - Log aggregation
- **Tempo** - Distributed tracing

### 🛠️ DevOps
- **Docker** - Containerization
- **Docker Compose** - Local development
- **GitHub Actions** - CI/CD pipeline
- **Terraform** - Infrastructure as Code

### 🔐 Security
- **JWT Authentication** - Stateless auth
- **OAuth 2.0** - Social login
- **Rate Limiting** - API protection
- **CORS** - Cross-origin security

### 📡 Integration
- **Swiss Ephemeris** - Astronomical calculations
- **VedAstro** - Vedic astrology engine
- **Matomo** - Privacy-focused analytics

## 🎯 Key Features

- **🔭 Accurate Calculations** - Swiss Ephemeris for precise planetary positions
- **📊 Interactive Charts** - Beautifully rendered birth charts and dashas
- **🔮 Predictive Analytics** - Major life events and transit predictions
- **📱 Responsive Design** - Works on all devices
- **🔐 Privacy Focused** - Self-hosted, no third-party trackers
- **🌍 Multi-language** - Internationalization support
- **📈 Analytics** - Built-in privacy-focused analytics

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+
- Python 3.10+ (for backend services)
- PostgreSQL 15+ with PostGIS extension

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vishaka-astrology.git
   cd vishaka-astrology
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the values in `.env` with your configuration.

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - Grafana: http://localhost:3000 (admin/admin)
   - Prometheus: http://localhost:9090

## 🏗️ Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── app/            # Application code
│   │   ├── api/        # API endpoints
│   │   ├── core/       # Core functionality
│   │   ├── models/     # Database models
│   │   └── services/   # Business logic
│   └── alembic/        # Database migrations
│
├── frontend/            # Next.js frontend
│   ├── app/            # App Router pages
│   ├── components/     # Reusable components
│   ├── lib/            # Utility functions
│   └── styles/         # Global styles
│
├── monitoring/          # Monitoring configuration
│   ├── grafana/        # Grafana dashboards
│   └── prometheus/     # Prometheus config
│
├── docker/             # Docker configuration
├── scripts/            # Utility scripts
└── tests/              # Test suites
```

## 🛠️ Development

### Backend Development

1. **Set up Python virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r backend/requirements-dev.txt
   ```

2. **Run database migrations**
   ```bash
   cd backend
   alembic upgrade head
   ```

3. **Start the development server**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Production Deployment

1. **Set up production environment variables**
   ```bash
   cp .env.example .env.prod
   # Update with production values
   ```

2. **Build and start in production mode**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Run database migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) (available when backend is running)
- [Architecture Decision Records](./docs/adr/)
- [Database Schema](./docs/database-schema.md)
- [API Reference](./docs/api-reference.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on how to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the Vedic Astrology community. May the stars guide you! 🌟
