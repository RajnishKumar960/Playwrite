# Use official Playwright image (includes headers/libs for browsers)
# This prevents "browser not found" or "libnss missing" errors
FROM mcr.microsoft.com/playwright/python:v1.49.0-jammy

# Set working directory to backend
WORKDIR /app/backend

# Copy requirements from root to current dir (backend)
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install browsers
RUN playwright install chromium

# Copy everything into /app
WORKDIR /app
COPY . .

# Move back into backend to run
WORKDIR /app/backend

# Expose port (Defaulting to 8080)
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Run with Gunicorn using gevent worker for WebSockets
CMD ["gunicorn", "-k", "gevent", "--workers", "1", "--bind", "0.0.0.0:8080", "--timeout", "600", "dashboard_api:app"]
