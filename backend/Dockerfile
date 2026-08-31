# FastAPI Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for audio handling and compiling
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    libportaudio2 \
    flac \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 8000

# Seed database on startup if empty and run uvicorn
CMD ["python", "run.py"]
