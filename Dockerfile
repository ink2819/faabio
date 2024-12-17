# Step 1: Backend (Flask API)
FROM python:3.12.0-slim AS backend

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/backend/venv/bin:$PATH"

# Set working directory for backend
WORKDIR /app/backend

# Install system dependencies (git for CharacterAI) and clean up afterward
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Create a virtual environment and install dependencies
RUN python -m venv venv
RUN venv/bin/pip install --upgrade pip
RUN venv/bin/pip install flask flask_cors git+https://github.com/kramcat/CharacterAI.git

# Copy backend code
COPY backend/ ./

# Step 2: Frontend (Static Files)
FROM nginx:alpine AS frontend

# Copy frontend static files to Nginx public directory
COPY frontend /usr/share/nginx/html

# Step 3: Final Container
FROM python:3.12.0-slim

# Set environment variables for final container
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/backend/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy backend code and dependencies
COPY --from=backend /app/backend /app/backend

# Copy frontend static files
COPY --from=frontend /usr/share/nginx/html /app/frontend

# Expose Flask API port
EXPOSE 5000

# Start the Flask API using virtual environment
CMD ["python", "backend/server.py"]
