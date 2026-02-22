FROM rust:1.84-slim AS builder

WORKDIR /build

# Copy manifest first for dependency caching
COPY backend-simple/Cargo.toml backend-simple/Cargo.lock ./

# Create dummy src to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src

# Copy actual source and rebuild
COPY backend-simple/src ./src
RUN touch src/main.rs && cargo build --release

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
