# syntax=docker/dockerfile:1.4
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies required for compilation and clean up apt cache
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications first to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies with pip cache mount for ultra-fast repeated builds
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY src/ /app/src/
COPY populate_db.py /app/populate_db.py

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
