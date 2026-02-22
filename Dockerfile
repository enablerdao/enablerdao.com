FROM rust:1.83-slim as builder

WORKDIR /build

# Copy backend files
COPY backend-simple/Cargo.toml backend-simple/Cargo.lock* ./
COPY backend-simple/src ./src

# Build release binary
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install CA certificates for HTTPS
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /build/target/release/enablerdao-server /app/

# Copy frontend files
COPY frontend /app/frontend

EXPOSE 8080

CMD ["/app/enablerdao-server"]
