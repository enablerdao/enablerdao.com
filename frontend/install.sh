#!/usr/bin/env bash
# EnablerDAO — enabler-cli installer
# Usage: curl -fsSL https://enablerdao.com/install.sh | bash
#   or:  CHATWEB_API_KEY=xxx curl -fsSL https://enablerdao.com/install.sh | bash
set -euo pipefail

REPO="enablerdao/enabler-cli"
INSTALL_DIR="${ENABLER_INSTALL_DIR:-$HOME/.enabler/bin}"
API_KEY="${CHATWEB_API_KEY:-}"

# ---------- helpers ----------
info()  { printf '\033[0;32m[enabler]\033[0m %s\n' "$1"; }
warn()  { printf '\033[0;33m[enabler]\033[0m %s\n' "$1"; }
error() { printf '\033[0;31m[enabler]\033[0m %s\n' "$1" >&2; exit 1; }

check_deps() {
  for cmd in curl git; do
    command -v "$cmd" >/dev/null 2>&1 || error "'$cmd' is required but not found. Please install it first."
  done
}

detect_platform() {
  local os arch
  os="$(uname -s)"
  arch="$(uname -m)"

  case "$os" in
    Linux)  OS="linux" ;;
    Darwin) OS="darwin" ;;
    *)      error "Unsupported OS: $os (Linux and macOS only)" ;;
  esac

  case "$arch" in
    x86_64|amd64)  ARCH="x86_64" ;;
    arm64|aarch64) ARCH="aarch64" ;;
    *)             error "Unsupported architecture: $arch" ;;
  esac

  PLATFORM="${OS}-${ARCH}"
  info "Detected platform: $PLATFORM"
}

get_latest_release() {
  RELEASE_URL="https://api.github.com/repos/${REPO}/releases/latest"
  TAG=$(curl -fsSL "$RELEASE_URL" 2>/dev/null | grep '"tag_name"' | head -1 | sed 's/.*"tag_name": *"//;s/".*//')
  if [ -z "$TAG" ]; then
    warn "Could not fetch latest release. Using source install."
    TAG=""
  fi
}

install_from_release() {
  local url="https://github.com/${REPO}/releases/download/${TAG}/enabler-cli-${TAG}-${PLATFORM}.tar.gz"
  info "Downloading enabler-cli ${TAG}..."

  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT

  if curl -fsSL "$url" -o "$tmp/enabler-cli.tar.gz" 2>/dev/null; then
    mkdir -p "$INSTALL_DIR"
    tar -xzf "$tmp/enabler-cli.tar.gz" -C "$tmp"
    # Find the binary
    local bin
    bin="$(find "$tmp" -name 'enablerdao' -o -name 'enabler-cli' | head -1)"
    if [ -n "$bin" ]; then
      cp "$bin" "$INSTALL_DIR/enablerdao"
      chmod +x "$INSTALL_DIR/enablerdao"
      return 0
    fi
  fi
  return 1
}

install_from_source() {
  info "Building from source..."
  command -v cargo >/dev/null 2>&1 || error "'cargo' is required for source install. Install Rust: https://rustup.rs"
  cargo install --git "https://github.com/${REPO}.git" --locked 2>/dev/null || \
    cargo install --git "https://github.com/${REPO}.git"
  INSTALL_DIR="$HOME/.cargo/bin"
}

setup_path() {
  local shell_rc=""
  case "${SHELL:-/bin/bash}" in
    */zsh)  shell_rc="$HOME/.zshrc" ;;
    */bash) shell_rc="$HOME/.bashrc" ;;
    */fish) shell_rc="$HOME/.config/fish/config.fish" ;;
    *)      shell_rc="$HOME/.profile" ;;
  esac

  if [ -n "$shell_rc" ] && ! echo "$PATH" | grep -q "$INSTALL_DIR"; then
    if [ -f "$shell_rc" ] && grep -q "$INSTALL_DIR" "$shell_rc" 2>/dev/null; then
      : # already in rc
    else
      echo "" >> "$shell_rc"
      echo "# EnablerDAO CLI" >> "$shell_rc"
      echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$shell_rc"
      info "Added $INSTALL_DIR to PATH in $shell_rc"
    fi
  fi
}

setup_api_key() {
  if [ -n "$API_KEY" ]; then
    local config_dir="$HOME/.enabler"
    mkdir -p "$config_dir"
    cat > "$config_dir/config.toml" <<CONF
# EnablerDAO CLI configuration
[auth]
chatweb_api_key = "$API_KEY"
CONF
    chmod 600 "$config_dir/config.toml"
    info "API key saved to ~/.enabler/config.toml"
  fi
}

# ---------- main ----------
main() {
  echo ""
  info "=== EnablerDAO CLI Installer ==="
  echo ""

  check_deps
  detect_platform
  get_latest_release

  mkdir -p "$INSTALL_DIR"

  local installed=false
  if [ -n "$TAG" ]; then
    if install_from_release; then
      installed=true
    else
      warn "Binary release not available, falling back to source build..."
    fi
  fi

  if [ "$installed" = false ]; then
    install_from_source
  fi

  setup_path
  setup_api_key

  echo ""
  info "Installation complete!"
  echo ""
  info "  enablerdao projects        # List available projects"
  info "  enablerdao improve [repo]  # Start AI-powered improvements"
  info "  enablerdao status          # Check service status"
  echo ""

  if [ -z "$API_KEY" ]; then
    warn "No CHATWEB_API_KEY set. Get one at https://chatweb.ai"
    warn "Then run: enablerdao auth <your-api-key>"
  fi

  info "Restart your terminal or run: export PATH=\"$INSTALL_DIR:\$PATH\""
  echo ""
}

main
