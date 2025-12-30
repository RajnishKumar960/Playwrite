# Use official Playwright image (includes headers/libs for browsers)
# This prevents "browser not found" or "libnss missing" errors
FROM mcr.microsoft.com/playwright/python:v1.49.0-jammy

# Set working directory
WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install python dependencies (gunicorn, flask, etc.)
RUN pip install --no-cache-dir -r requirements.txt

# The base image already includes Playwright and browsers
# No additional browser installation needed

# Copy the rest of the application
COPY . .

# Expose port (Leapcell often uses 8080)
EXPOSE 8080

# Environment variables
ENV PLAY_API_PORT=8080
ENV PYTHONUNBUFFERED=1

# Run with Gunicorn (Production Server)
CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:8080", "--timeout", "600", "play_api:app"]
