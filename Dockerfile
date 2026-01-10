# Lightweight Python API Server (No Playwright)
# Optimized for Render Free Tier (512MB RAM limit)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Environment variables
ENV PLAY_API_PORT=8080
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8080/api/health')"

# Run with Gunicorn (Production Server) - Dashboard API with eventlet for WebSocket support
CMD ["gunicorn", "--workers", "1", "--worker-class", "eventlet", "--bind", "0.0.0.0:8080", "--timeout", "120", "--max-requests", "1000", "--max-requests-jitter", "100", "dashboard_api:app"]
