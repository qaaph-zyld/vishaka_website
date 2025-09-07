# Vedic Astrology Platform - Backend

## Overview
This is the backend service for the Vedic Astrology Platform, built with FastAPI and PostgreSQL. It provides a RESTful API for astrological calculations, user management, and chart generation.

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Redis (for caching and background tasks)
- Git

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/vedic-astrology-platform.git
cd vedic-astrology-platform/backend
```

### 2. Set up the development environment (Windows)

#### Using PowerShell:
```powershell
# Run the setup script
.\setup-dev.ps1
```

### 3. Configure the environment

1. Copy `.env.example` to `.env` if not already done:
   ```bash
   copy .env.example .env
   ```

2. Update the `.env` file with your database credentials and other settings.

### 4. Initialize the database

```bash
python init-db.py
```

### 5. Run database migrations

```bash
alembic upgrade head
```

### 6. Start the development server

```bash
uvicorn app.main:app --reload
```

The API documentation will be available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── alembic/               # Database migration scripts
├── app/
│   ├── api/               # API routes
│   ├── core/              # Core functionality (config, security, etc.)
│   ├── crud/              # Database operations
│   ├── db/                # Database configuration
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic models
│   └── services/          # Business logic
├── tests/                 # Test files
├── .env.example           # Example environment variables
├── .pre-commit-config.yaml # Pre-commit hooks
├── alembic.ini            # Alembic configuration
├── init-db.py            # Database initialization script
├── requirements.txt       # Production dependencies
├── requirements-dev.txt   # Development dependencies
└── setup-dev.ps1         # Development environment setup script
```

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
isort .
```

### Linting

```bash
flake8
mypy .
```

### Pre-commit Hooks

Install pre-commit hooks:

```bash
pre-commit install
```

## Deployment

### Production

1. Set up a production database (PostgreSQL with PostGIS)
2. Configure environment variables in `.env`
3. Run migrations:
   ```bash
   alembic upgrade head
   ```
4. Start the production server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

## API Documentation

- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI Schema: `/openapi.json`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
