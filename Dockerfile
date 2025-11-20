# SpaceSense Lite - Optimized Docker Configuration
# Multi-stage build for smaller final image

# Build stage
FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements-docker.txt requirements-minimal.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --user -r requirements-docker.txt

# Production stage
FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy Python packages from builder stage
COPY --from=builder /root/.local /root/.local

# Set working directory
WORKDIR /app

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 spacesense && \
    chown -R spacesense:spacesense /app

# Switch to non-root user
USER spacesense

# Make sure scripts are executable
RUN chmod +x run.py

# Set Python path to include user packages
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/root/.local/lib/python3.11/site-packages:$PYTHONPATH

# Expose port
EXPOSE 8006

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8006/api/debris/live || exit 1

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=8006
ENV DEBUG=False

# Run application using the run script
CMD ["python", "run.py"]