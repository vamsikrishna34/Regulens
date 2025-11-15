
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files first (for cache efficiency)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source
COPY src ./src

# Build fat JAR (Spring Boot)
RUN ./mvnw clean package -DskipTests --no-transfer-progress


FROM eclipse-temurin:17-jre-alpine

# Create non-root user (HF best practice)
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Install Ollama (optional — comment out if skipping LLM)
RUN apk add --no-cache curl && \
    curl -fsSL https://ollama.com/install.sh | sh

# Copy JAR, data, and models
COPY --from=builder /app/target/*.jar app.jar
COPY data/ ./data/
COPY ml-engine/models/ ./models/

# Expose port
EXPOSE 8080

# Health check (critical for HF Spaces stability)
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Switch to non-root
USER appuser

# Start Ollama (in background) + Spring Boot
CMD ["sh", "-c", "ollama serve & sleep 5 && java -jar app.jar"]