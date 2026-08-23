FROM python:3.12-slim

WORKDIR /app

# Install system dependencies required for psycopg2, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8080

# Command to run the application
CMD uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8080}
