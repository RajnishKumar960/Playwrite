# Use official Playwright image
FROM mcr.microsoft.com/playwright/python:v1.49.0-jammy

# Set working directory
WORKDIR /app

# Copy requirements from backend directory
COPY backend/requirements.txt ./backend/

# Install python dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Install browsers
RUN playwright install chromium

# Copy everything into /app
COPY . .

# Move into backend to run
WORKDIR /app/backend

# Expose port (Render uses dynamic $PORT, defaulting to 8080)
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Run with Gunicorn using gevent worker for WebSockets
CMD ["sh", "-c", "gunicorn -k gevent --workers 1 --bind 0.0.0.0:$PORT --timeout 600 dashboard_api:app"]
