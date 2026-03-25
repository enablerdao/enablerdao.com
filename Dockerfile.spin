# Stage 1: Build WASM component
FROM rust:1.93-bookworm AS builder

RUN rustup target add wasm32-wasip2

WORKDIR /build

# Copy spin-component source and static assets
COPY spin-component/ spin-component/
COPY static/ static/

# Build WASM component
RUN cargo build --manifest-path spin-component/Cargo.toml --target wasm32-wasip2 --release

# Stage 2: Runtime with Spin
FROM debian:bookworm-slim

# Install Spin CLI
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && \
    ARCH=$(dpkg --print-architecture) && \
    case "$ARCH" in \
      amd64) SPIN_ARCH="linux-amd64" ;; \
      arm64) SPIN_ARCH="linux-aarch64" ;; \
      *) echo "Unsupported arch: $ARCH" && exit 1 ;; \
    esac && \
    curl -fsSL "https://github.com/spinframework/spin/releases/download/v3.6.2/spin-v3.6.2-${SPIN_ARCH}.tar.gz" \
      -o /tmp/spin.tar.gz && \
    tar xzf /tmp/spin.tar.gz -C /usr/local/bin spin && \
    chmod +x /usr/local/bin/spin && \
    rm -f /tmp/spin.tar.gz && \
    apt-get purge -y curl && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -g 1000 spinapp && useradd -u 1000 -g spinapp -m spinapp

WORKDIR /app

# Copy Spin config and built WASM
COPY spin.toml spin.toml
COPY --from=builder /build/spin-component/target/wasm32-wasip2/release/enablerdao_spin.wasm \
     spin-component/target/wasm32-wasip2/release/enablerdao_spin.wasm

RUN chown -R spinapp:spinapp /app && mkdir -p /data && chown spinapp:spinapp /data
USER spinapp

ENV SPIN_TELEMETRY_DISABLED=1

EXPOSE 8080

ENTRYPOINT ["spin", "up", "--listen", "0.0.0.0:8080", "--state-dir", "/data/spin-state"]
