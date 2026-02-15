#!/bin/sh
# EnablerDAO CLI Installer
# Usage: curl -fsSL https://enablerdao.com/install.sh | bash
#
# This script installs the `enablerdao` command-line tool for interacting
# with EnablerDAO projects, checking service status, and contributing
# to the ecosystem via Claude Code.

set -e

# ─────────────────────────────────────────────
# Colors & Formatting
# ─────────────────────────────────────────────
if [ -t 1 ] && [ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]; then
  GREEN='\033[0;32m'
  BRIGHT_GREEN='\033[1;32m'
  CYAN='\033[0;36m'
  BRIGHT_CYAN='\033[1;36m'
  YELLOW='\033[0;33m'
  RED='\033[0;31m'
  DIM='\033[2m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  GREEN='' BRIGHT_GREEN='' CYAN='' BRIGHT_CYAN=''
  YELLOW='' RED='' DIM='' BOLD='' RESET=''
fi

# ─────────────────────────────────────────────
# Helper Functions
# ─────────────────────────────────────────────
info()    { printf "${CYAN}[INFO]${RESET} %s\n" "$1"; }
success() { printf "${GREEN}[ OK ]${RESET} %s\n" "$1"; }
warn()    { printf "${YELLOW}[WARN]${RESET} %s\n" "$1"; }
error()   { printf "${RED}[FAIL]${RESET} %s\n" "$1"; }
step()    { printf "${BRIGHT_GREEN}  >>> ${RESET}%s\n" "$1"; }

# ─────────────────────────────────────────────
# Banner
# ─────────────────────────────────────────────
show_banner() {
  printf "${BRIGHT_GREEN}"
  cat << 'BANNER'

  ███████╗███╗   ██╗ █████╗ ██████╗ ██╗     ███████╗██████╗
  ██╔════╝████╗  ██║██╔══██╗██╔══██╗██║     ██╔════╝██╔══██╗
  █████╗  ██╔██╗ ██║███████║██████╔╝██║     █████╗  ██████╔╝
  ██╔══╝  ██║╚██╗██║██╔══██║██╔══██╗██║     ██╔══╝  ██╔══██╗
  ███████╗██║ ╚████║██║  ██║██████╔╝███████╗███████╗██║  ██║
  ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
                    ██████╗  █████╗  ██████╗
                    ██╔══██╗██╔══██╗██╔═══██╗
                    ██║  ██║███████║██║   ██║
                    ██║  ██║██╔══██║██║   ██║
                    ██████╔╝██║  ██║╚██████╔╝
                    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝

BANNER
  printf "${RESET}"
  printf "${CYAN}        CLI Installer${RESET}\n"
  printf "${DIM}        https://enablerdao.com${RESET}\n"
  echo ""
  printf "${DIM}  ════════════════════════════════════════════════════════${RESET}\n"
  echo ""
}

# ─────────────────────────────────────────────
# Prerequisite Checks
# ─────────────────────────────────────────────
check_prerequisites() {
  info "Checking prerequisites..."
  echo ""
  _ok=0
  _total=2

  # 1. git
  if command -v git >/dev/null 2>&1; then
    success "git $(git --version | sed 's/git version //')"
    _ok=$((_ok + 1))
  else
    warn "git is not installed (optional, needed for 'enablerdao work')"
    step "Install: https://git-scm.com/downloads"
  fi

  # 2. curl or wget (for API calls)
  if command -v curl >/dev/null 2>&1; then
    success "curl found"
    _ok=$((_ok + 1))
  elif command -v wget >/dev/null 2>&1; then
    success "wget found"
    _ok=$((_ok + 1))
  else
    warn "Neither curl nor wget found (some features may be limited)"
  fi

  echo ""
  success "Prerequisite check done (${_ok}/${_total})"
  echo ""
}

# ─────────────────────────────────────────────
# Install the enablerdao CLI
# ─────────────────────────────────────────────
install_cli() {
  info "Installing enablerdao CLI..."

  CLI_DIR="${HOME}/.local/bin"
  CLI_PATH="${CLI_DIR}/enablerdao"

  mkdir -p "${CLI_DIR}"

  # Write the CLI script
  cat > "${CLI_PATH}" << 'CLIFILE'
#!/bin/sh
# enablerdao — EnablerDAO CLI
# https://enablerdao.com

set -e

ENABLERDAO_VERSION="1.0.0"

# ─── Colors ───
if [ -t 1 ] && [ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]; then
  GREEN='\033[0;32m'
  BRIGHT_GREEN='\033[1;32m'
  CYAN='\033[0;36m'
  BRIGHT_CYAN='\033[1;36m'
  YELLOW='\033[0;33m'
  RED='\033[0;31m'
  DIM='\033[2m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  GREEN='' BRIGHT_GREEN='' CYAN='' BRIGHT_CYAN=''
  YELLOW='' RED='' DIM='' BOLD='' RESET=''
fi

WORKSPACE="${HOME}/enablerdao-workspace"
ORG="enablerdao"
API_BASE="https://enablerdao.com"

info()    { printf "${CYAN}[INFO]${RESET} %s\n" "$1"; }
success() { printf "${GREEN}[ OK ]${RESET} %s\n" "$1"; }
warn()    { printf "${YELLOW}[WARN]${RESET} %s\n" "$1"; }
errormsg(){ printf "${RED}[FAIL]${RESET} %s\n" "$1"; }
step()    { printf "${BRIGHT_GREEN}  >>> ${RESET}%s\n" "$1"; }

# ─── HTTP helper (curl or wget) ───
http_get() {
  _url="$1"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL --connect-timeout 5 "$_url" 2>/dev/null
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- --timeout=5 "$_url" 2>/dev/null
  else
    return 1
  fi
}

# ─── open URL in browser ───
open_url() {
  _url="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$_url" 2>/dev/null &
  elif command -v open >/dev/null 2>&1; then
    open "$_url" 2>/dev/null &
  elif command -v wslview >/dev/null 2>&1; then
    wslview "$_url" 2>/dev/null &
  else
    info "Open this URL in your browser:"
    step "$_url"
    return 0
  fi
  success "Opened ${_url}"
}

# ═══════════════════════════════════════════════
# COMMANDS
# ═══════════════════════════════════════════════

# ─── (default) Show welcome / info ───
cmd_info() {
  echo ""
  printf "${BRIGHT_GREEN}"
  cat << 'LOGO'
  ███████╗███╗   ██╗ █████╗ ██████╗ ██╗     ███████╗██████╗
  ██╔════╝████╗  ██║██╔══██╗██╔══██╗██║     ██╔════╝██╔══██╗
  █████╗  ██╔██╗ ██║███████║██████╔╝██║     █████╗  ██████╔╝
  ██╔══╝  ██║╚██╗██║██╔══██║██╔══██╗██║     ██╔══╝  ██╔══██╗
  ███████╗██║ ╚████║██║  ██║██████╔╝███████╗███████╗██║  ██║
  ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
                    ██████╗  █████╗  ██████╗
                    ██╔══██╗██╔══██╗██╔═══██╗
                    ██║  ██║███████║██║   ██║
                    ██║  ██║██╔══██║██║   ██║
                    ██████╔╝██║  ██║╚██████╔╝
                    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
LOGO
  printf "${RESET}"
  echo ""
  printf "  ${CYAN}EnablerDAO CLI${RESET} ${DIM}v${ENABLERDAO_VERSION}${RESET}\n"
  printf "  ${DIM}Open-source tools for a safer, smarter internet${RESET}\n"
  echo ""
  printf "  ${DIM}════════════════════════════════════════════════════${RESET}\n"
  echo ""
  printf "  ${BRIGHT_GREEN}Website${RESET}   https://enablerdao.com\n"
  printf "  ${BRIGHT_GREEN}GitHub${RESET}    https://github.com/enablerdao\n"
  printf "  ${BRIGHT_GREEN}Token${RESET}     EBR on Solana\n"
  printf "  ${BRIGHT_GREEN}Contact${RESET}   contact@enablerdao.com\n"
  echo ""
  printf "  ${DIM}════════════════════════════════════════════════════${RESET}\n"
  echo ""
  printf "  ${CYAN}Quick commands:${RESET}\n"
  printf "    ${GREEN}enablerdao projects${RESET}    List all EnablerDAO projects\n"
  printf "    ${GREEN}enablerdao status${RESET}      Check service status\n"
  printf "    ${GREEN}enablerdao docs${RESET}        Open documentation in browser\n"
  printf "    ${GREEN}enablerdao work${RESET} <repo> Fork, clone & start coding\n"
  printf "    ${GREEN}enablerdao help${RESET}        Show all commands\n"
  echo ""
}

# ─── help: Show all commands ───
cmd_help() {
  echo ""
  printf "${BRIGHT_GREEN}  enablerdao${RESET} ${DIM}v${ENABLERDAO_VERSION}${RESET} — EnablerDAO CLI\n"
  echo ""
  printf "${CYAN}USAGE:${RESET}\n"
  echo "  enablerdao <command> [args]"
  echo ""
  printf "${CYAN}GENERAL COMMANDS:${RESET}\n"
  printf "  ${GREEN}(no command)${RESET}          Show welcome info\n"
  printf "  ${GREEN}projects${RESET}              List all EnablerDAO projects & services\n"
  printf "  ${GREEN}status${RESET}                Check live status of EnablerDAO services\n"
  printf "  ${GREEN}docs${RESET}                  Open documentation in browser\n"
  printf "  ${GREEN}token${RESET}                 Show EBR token info\n"
  printf "  ${GREEN}version${RESET}               Show CLI version\n"
  echo ""
  printf "${CYAN}DEVELOPER COMMANDS:${RESET}\n"
  printf "  ${GREEN}repos${RESET}                 List GitHub repositories\n"
  printf "  ${GREEN}work${RESET} <repo>           Fork, clone & start coding with Claude Code\n"
  printf "  ${GREEN}pr${RESET}   <repo>           Commit changes and create a Pull Request\n"
  printf "  ${GREEN}dev-status${RESET}            Show repos you are working on locally\n"
  echo ""
  printf "${CYAN}UTILITY COMMANDS:${RESET}\n"
  printf "  ${GREEN}update${RESET}                Update enablerdao CLI to latest version\n"
  printf "  ${GREEN}uninstall${RESET}             Remove enablerdao CLI\n"
  printf "  ${GREEN}help${RESET}                  Show this help message\n"
  echo ""
  printf "${CYAN}EXAMPLES:${RESET}\n"
  printf "  ${DIM}\$ enablerdao${RESET}                          ${DIM}# welcome & info${RESET}\n"
  printf "  ${DIM}\$ enablerdao projects${RESET}                  ${DIM}# see all projects${RESET}\n"
  printf "  ${DIM}\$ enablerdao status${RESET}                    ${DIM}# check if services are up${RESET}\n"
  printf "  ${DIM}\$ enablerdao docs${RESET}                      ${DIM}# open docs in browser${RESET}\n"
  printf "  ${DIM}\$ enablerdao work OptimaChain${RESET}          ${DIM}# start contributing${RESET}\n"
  echo ""
  printf "${DIM}Workspace: ${WORKSPACE}${RESET}\n"
  printf "${DIM}Docs:      https://enablerdao.com/install${RESET}\n"
  echo ""
}

# ─── projects: List all EnablerDAO projects ───
cmd_projects() {
  echo ""
  printf "${BRIGHT_GREEN}  EnablerDAO Projects${RESET}\n"
  printf "${DIM}  https://enablerdao.com/projects${RESET}\n"
  echo ""
  printf "${DIM}  ═══════════════════════════════════════════════════════════════════${RESET}\n"
  echo ""

  # ── AI & Technology ──
  printf "  ${CYAN}AI & Technology${RESET}\n"
  printf "  ${DIM}──────────────────────────────────────────────────────────────${RESET}\n"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "Chatweb.ai" "AI-driven web automation agent" "https://chatweb.ai"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "Elio Chat" "Offline AI chat for iPhone" "https://elio.love"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "News.xyz" "AI-powered news aggregation" "https://news.xyz"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "News.cloud" "News API platform for developers" "https://news.cloud"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "ChatNews.link" "AI news explainer & summarizer" "https://chatnews.link"
  echo ""

  # ── Business Tools ──
  printf "  ${YELLOW}Business Tools${RESET}\n"
  printf "  ${DIM}──────────────────────────────────────────────────────────────${RESET}\n"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "StayFlow" "Vacation rental management" "https://stayflowapp.com"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "BANTO" "Invoice management for construction" "https://banto.work"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "Totonos" "Financial automation platform" "https://totonos.jp"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "VOLT" "Live auction platform" "https://volt.tokyo"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "Enabler" "Lifestyle service platform" "https://enabler.fun"
  echo ""

  # ── Security & Education ──
  printf "  ${RED}Security & Education${RESET}\n"
  printf "  ${DIM}──────────────────────────────────────────────────────────────${RESET}\n"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "Security Scan" "Free web security scanner (A-F grade)" "https://chatnews.tech"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "PhishGuard" "Phishing prevention SaaS" "https://enabler.cc"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "DojoC" "Cybersecurity learning platform" "https://www.dojoc.io"
  echo ""

  # ── Lifestyle & Events ──
  printf "  ${BRIGHT_MAGENTA}Lifestyle & Events${RESET}\n"
  printf "  ${DIM}──────────────────────────────────────────────────────────────${RESET}\n"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "Enabler" "Premium lifestyle service" "https://enabler.fun"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "SOLUNA" "Real events platform (ZAMNA.hawaii)" "https://solun.art"
  echo ""

  # ── Sports & Community ──
  printf "  ${BRIGHT_CYAN}Sports & Community${RESET}\n"
  printf "  ${DIM}──────────────────────────────────────────────────────────────${RESET}\n"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "JitsuFlow" "BJJ training & dojo management" "https://jitsuflow.app"
  printf "  ${GREEN}%-16s${RESET} ${DIM}%-42s${RESET} %s\n" \
    "Murata BJJ" "BJJ community & events" "https://muratabjj.com"
  echo ""

  printf "${DIM}  ═══════════════════════════════════════════════════════════════════${RESET}\n"
  echo ""
  printf "  ${DIM}Total: 15 active projects${RESET}\n"
  printf "  ${DIM}View all: https://enablerdao.com/projects${RESET}\n"
  echo ""
}

# ─── status: Check service status ───
cmd_status() {
  echo ""
  printf "${BRIGHT_GREEN}  EnablerDAO Service Status${RESET}\n"
  printf "${DIM}  Checking live status of services...${RESET}\n"
  echo ""
  printf "  ${DIM}%-20s %-10s %s${RESET}\n" "SERVICE" "STATUS" "RESPONSE"
  printf "  ${DIM}%-20s %-10s %s${RESET}\n" "────────────────────" "──────────" "────────────────"

  # List of services to check
  _services="enablerdao.com chatweb.ai elio.love news.xyz news.cloud chatnews.link stayflowapp.com banto.work enabler.cc enabler.fun solun.art"

  for _svc in $_services; do
    printf "  ${DIM}%-20s${RESET} " "$_svc"

    # Check HTTP status using curl's built-in time measurement
    if command -v curl >/dev/null 2>&1; then
      _result=$(curl -o /dev/null -s -w "%{http_code} %{time_total}" --connect-timeout 5 --max-time 10 "https://${_svc}" 2>/dev/null) || _result="000 0"
      _code=$(echo "$_result" | awk '{print $1}')
      _time_sec=$(echo "$_result" | awk '{print $2}')

      # Convert seconds to ms (portable: multiply by 1000 using awk)
      _time=$(echo "$_time_sec" | awk '{printf "%dms", $1 * 1000}')

      case "$_code" in
        200|301|302|303|307|308)
          printf "${GREEN}%-10s${RESET} ${DIM}%s (HTTP %s)${RESET}\n" "UP" "$_time" "$_code"
          ;;
        000)
          printf "${RED}%-10s${RESET} ${DIM}%s${RESET}\n" "DOWN" "connection failed"
          ;;
        *)
          printf "${YELLOW}%-10s${RESET} ${DIM}%s (HTTP %s)${RESET}\n" "WARN" "$_time" "$_code"
          ;;
      esac
    else
      printf "${YELLOW}%-10s${RESET} ${DIM}%s${RESET}\n" "SKIP" "curl not available"
    fi
  done

  echo ""
  printf "  ${DIM}Checked at: $(date '+%Y-%m-%d %H:%M:%S %Z')${RESET}\n"
  echo ""
}

# ─── docs: Open documentation ───
cmd_docs() {
  echo ""
  info "Opening EnablerDAO documentation..."
  echo ""

  _target="${1:-}"
  case "$_target" in
    install|setup)
      open_url "https://enablerdao.com/install"
      ;;
    token|ebr)
      open_url "https://enablerdao.com/token"
      ;;
    security)
      open_url "https://enablerdao.com/security"
      ;;
    projects)
      open_url "https://enablerdao.com/projects"
      ;;
    github|gh)
      open_url "https://github.com/enablerdao"
      ;;
    *)
      open_url "https://enablerdao.com"
      ;;
  esac
  echo ""
  printf "${DIM}  Available doc targets: install, token, security, projects, github${RESET}\n"
  printf "${DIM}  Example: enablerdao docs token${RESET}\n"
  echo ""
}

# ─── token: Show EBR token info ───
cmd_token() {
  echo ""
  printf "${BRIGHT_GREEN}  EBR Token Info${RESET}\n"
  echo ""
  printf "  ${DIM}═══════════════════════════════════════════════════════${RESET}\n"
  echo ""
  printf "  ${CYAN}Name:${RESET}       EBR (Enabler)\n"
  printf "  ${CYAN}Network:${RESET}    Solana\n"
  printf "  ${CYAN}Address:${RESET}    E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y\n"
  printf "  ${CYAN}Purpose:${RESET}    Governance token for EnablerDAO\n"
  echo ""
  printf "  ${DIM}EBR is NOT an investment token. It is a governance tool${RESET}\n"
  printf "  ${DIM}for participating in EnablerDAO decisions.${RESET}\n"
  echo ""
  printf "  ${CYAN}How to earn:${RESET}\n"
  printf "    ${GREEN}1.${RESET} Contribute code (pull requests)\n"
  printf "    ${GREEN}2.${RESET} Report bugs or security issues\n"
  printf "    ${GREEN}3.${RESET} Write documentation\n"
  printf "    ${GREEN}4.${RESET} Participate in governance votes\n"
  echo ""
  printf "  ${DIM}Explorer:${RESET} https://solscan.io/token/E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y\n"
  printf "  ${DIM}Details:${RESET}  https://enablerdao.com/token\n"
  echo ""
}

# ─── version ───
cmd_version() {
  printf "enablerdao v${ENABLERDAO_VERSION}\n"
}

# ─── repos: Show GitHub repos (via gh CLI or cached) ───
cmd_repos() {
  echo ""
  printf "${BRIGHT_GREEN}  EnablerDAO GitHub Repositories${RESET}\n"
  printf "${DIM}  https://github.com/${ORG}${RESET}\n"
  echo ""

  if command -v gh >/dev/null 2>&1; then
    printf "${DIM}  %-28s %-8s %s${RESET}\n" "REPOSITORY" "STARS" "DESCRIPTION"
    printf "${DIM}  %-28s %-8s %s${RESET}\n" "----------------------------" "--------" "-----------------------------------"
    gh api "orgs/${ORG}/repos?per_page=100&sort=updated" --paginate --jq '.[] | "  \(.name)\t\(.stargazers_count)\t\(.description // "-")"' 2>/dev/null | while IFS="$(printf '\t')" read -r name stars desc; do
      printf "${GREEN}%-30s${RESET} ${YELLOW}%-8s${RESET} ${DIM}%s${RESET}\n" "$name" "$stars" "$desc"
    done
  else
    printf "  ${DIM}%-28s %s${RESET}\n" "REPOSITORY" "DESCRIPTION"
    printf "  ${DIM}%-28s %s${RESET}\n" "----------------------------" "-----------------------------------"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "OptimaChain" "Next-gen blockchain platform"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "HyperFlux" "High-performance system"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "ShardX" "Sharding framework"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "NexaCore" "Core infrastructure"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "NeuraChain" "AI-powered chain"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "NovaLedger" "Distributed ledger"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "PulseChain" "Real-time chain"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "Aiden" "AI development environment"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "GeneLLM" "Gene-based LLM"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "NexOS" "Next-gen OS"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "enabler" "Core enabler module"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "timedrop" "Time-based distribution"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "stayflow" "Stay management"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "Synexia" "Synergy platform"
    printf "  ${GREEN}%-28s${RESET} ${DIM}%s${RESET}\n" "pocketai" "Pocket AI assistant"
    echo ""
    step "Install GitHub CLI for live data: https://cli.github.com/"
  fi
  echo ""
  step "To start working: enablerdao work <repo-name>"
  echo ""
}

# ─── work: Fork, clone, and start Claude Code ───
cmd_work() {
  _repo="$1"

  # If no repo specified, show interactive menu
  if [ -z "$_repo" ]; then
    echo ""
    printf "${BRIGHT_GREEN}  Select a project to work on:${RESET}\n"
    echo ""

    # Popular projects list with descriptions and API info
    printf "  ${CYAN}[1]${RESET} ${GREEN}Chatweb.ai${RESET}          ${DIM}AI web automation (Anthropic Claude API)${RESET}\n"
    printf "  ${CYAN}[2]${RESET} ${GREEN}enablerdao.com${RESET}      ${DIM}Main DAO website (Next.js)${RESET}\n"
    printf "  ${CYAN}[3]${RESET} ${GREEN}wisbee${RESET}              ${DIM}Private AI assistant (Local LLM)${RESET}\n"
    printf "  ${CYAN}[4]${RESET} ${GREEN}OptimaChain${RESET}         ${DIM}Next-gen blockchain platform${RESET}\n"
    printf "  ${CYAN}[5]${RESET} ${GREEN}MindBridge-iOS${RESET}      ${DIM}On-device AI chat (Qwen3-4B)${RESET}\n"
    printf "  ${CYAN}[6]${RESET} ${GREEN}stayflow${RESET}            ${DIM}Vacation rental management${RESET}\n"
    printf "  ${CYAN}[7]${RESET} ${GREEN}OpenHands${RESET}           ${DIM}Code assistant (OpenAI/Anthropic API)${RESET}\n"
    printf "  ${CYAN}[8]${RESET} ${GREEN}task-enabler-ai${RESET}     ${DIM}Task management with LINE${RESET}\n"
    printf "  ${CYAN}[0]${RESET} ${DIM}See all repositories${RESET}\n"
    echo ""
    printf "  ${YELLOW}Enter number [1-8, 0 for all]:${RESET} "
    read -r _choice

    case "$_choice" in
      1) _repo="chatweb.ai" ;;
      2) _repo="enablerdao.com" ;;
      3) _repo="wisbee" ;;
      4) _repo="OptimaChain" ;;
      5) _repo="MindBridge-iOS" ;;
      6) _repo="stayflow" ;;
      7) _repo="OpenHands" ;;
      8) _repo="task-enabler-ai" ;;
      0) cmd_repos; echo ""; printf "  ${YELLOW}Enter repository name:${RESET} "; read -r _repo ;;
      *) errormsg "Invalid choice"; exit 1 ;;
    esac

    if [ -z "$_repo" ]; then
      errormsg "No repository selected"
      exit 1
    fi
  fi

  REPO_DIR="${WORKSPACE}/${_repo}"

  echo ""
  printf "${BRIGHT_GREEN}  ╔══════════════════════════════════════════╗${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}  Starting work on ${CYAN}${ORG}/${_repo}${RESET}"
  # Pad the right side
  _pad=$((22 - ${#_repo}))
  _j=0
  while [ $_j -lt $_pad ] 2>/dev/null; do printf " "; _j=$((_j + 1)); done
  printf "${BRIGHT_GREEN}║${RESET}\n"
  printf "${BRIGHT_GREEN}  ╚══════════════════════════════════════════╝${RESET}\n"
  echo ""

  # Ensure workspace exists
  mkdir -p "${WORKSPACE}"

  # Check if gh is available for forking
  if command -v gh >/dev/null 2>&1; then
    # Fork the repository
    info "Forking ${ORG}/${_repo}..."
    if gh repo fork "${ORG}/${_repo}" --clone=false 2>/dev/null; then
      success "Repository forked"
    else
      warn "Fork may already exist, continuing..."
    fi

    # Clone the fork
    if [ -d "${REPO_DIR}" ]; then
      warn "Directory already exists: ${REPO_DIR}"
      info "Pulling latest changes..."
      cd "${REPO_DIR}"
      git pull --rebase 2>/dev/null || true
      success "Updated ${REPO_DIR}"
    else
      info "Cloning forked repository..."
      GH_USER=$(gh api user --jq '.login' 2>/dev/null)
      if [ -n "${GH_USER}" ]; then
        gh repo clone "${GH_USER}/${_repo}" "${REPO_DIR}" 2>/dev/null || \
          git clone "https://github.com/${GH_USER}/${_repo}.git" "${REPO_DIR}"
      else
        git clone "https://github.com/${ORG}/${_repo}.git" "${REPO_DIR}"
      fi
      success "Cloned to ${REPO_DIR}"

      # Set upstream
      cd "${REPO_DIR}"
      git remote add upstream "https://github.com/${ORG}/${_repo}.git" 2>/dev/null || true
      success "Upstream remote set to ${ORG}/${_repo}"
    fi
  else
    # No gh, use plain git
    if [ -d "${REPO_DIR}" ]; then
      warn "Directory already exists: ${REPO_DIR}"
      info "Pulling latest changes..."
      cd "${REPO_DIR}"
      git pull --rebase 2>/dev/null || true
    else
      info "Cloning repository (install gh CLI to auto-fork)..."
      git clone "https://github.com/${ORG}/${_repo}.git" "${REPO_DIR}"
      success "Cloned to ${REPO_DIR}"
    fi
  fi

  echo ""

  # Create a feature branch
  cd "${REPO_DIR}"
  _branch="dev/enablerdao-$(date +%Y%m%d-%H%M%S)"
  git checkout -b "${_branch}" 2>/dev/null || true
  success "Created branch: ${_branch}"
  echo ""

  # Launch Claude Code if available
  if command -v claude >/dev/null 2>&1; then
    info "Launching Claude Code..."
    step "Working directory: ${REPO_DIR}"
    step "Branch: ${_branch}"
    echo ""
    printf "${BRIGHT_GREEN}  ┌─────────────────────────────────────────┐${RESET}\n"
    printf "${BRIGHT_GREEN}  │${RESET}  ${CYAN}Claude Code is starting...${RESET}              ${BRIGHT_GREEN}│${RESET}\n"
    printf "${BRIGHT_GREEN}  │${RESET}  ${DIM}Type your task and let AI handle it.${RESET}    ${BRIGHT_GREEN}│${RESET}\n"
    printf "${BRIGHT_GREEN}  │${RESET}  ${DIM}When done: enablerdao pr ${_repo}${RESET}"
    _pad2=$((14 - ${#_repo}))
    _j=0
    while [ $_j -lt $_pad2 ] 2>/dev/null; do printf " "; _j=$((_j + 1)); done
    printf "${BRIGHT_GREEN}│${RESET}\n"
    printf "${BRIGHT_GREEN}  └─────────────────────────────────────────┘${RESET}\n"
    echo ""
    cd "${REPO_DIR}"
    claude
  else
    success "Repository ready at: ${REPO_DIR}"
    step "Install Claude Code for AI-assisted development:"
    step "  npm install -g @anthropic-ai/claude-code"
    step "Then run: cd ${REPO_DIR} && claude"
  fi
}

# ─── pr: Commit and create PR ───
cmd_pr() {
  _repo="$1"
  if [ -z "$_repo" ]; then
    errormsg "Repository name required"
    step "Usage: enablerdao pr <repo-name>"
    exit 1
  fi

  REPO_DIR="${WORKSPACE}/${_repo}"

  if [ ! -d "${REPO_DIR}" ]; then
    errormsg "Repository not found at ${REPO_DIR}"
    step "Run 'enablerdao work ${_repo}' first"
    exit 1
  fi

  cd "${REPO_DIR}"
  echo ""

  # Check for changes
  if [ -z "$(git status --porcelain)" ]; then
    warn "No changes detected in ${_repo}"
    exit 0
  fi

  info "Preparing Pull Request for ${ORG}/${_repo}..."
  echo ""

  # Show changes summary
  _files_changed=$(git status --porcelain | wc -l | tr -d ' ')
  step "${_files_changed} file(s) changed"
  echo ""
  git status --short
  echo ""

  # Stage all changes
  git add -A

  # Generate commit message using claude if available
  if command -v claude >/dev/null 2>&1; then
    info "Generating commit message with Claude..."
    _diff=$(git diff --cached --stat)
    _commit_msg=$(claude --print "Generate a concise git commit message (1 line, max 72 chars) for these changes: ${_diff}" 2>/dev/null || echo "feat: update ${_repo} via EnablerDAO CLI")
  else
    _commit_msg="feat: update ${_repo} via EnablerDAO CLI"
  fi

  git commit -m "${_commit_msg}" || true
  success "Committed: ${_commit_msg}"
  echo ""

  # Push and create PR
  if command -v gh >/dev/null 2>&1; then
    _branch=$(git branch --show-current)
    info "Pushing branch ${_branch}..."
    git push -u origin "${_branch}" 2>/dev/null

    info "Creating Pull Request..."
    _pr_url=$(gh pr create \
      --title "${_commit_msg}" \
      --body "## Changes

This PR was created using [EnablerDAO CLI](https://enablerdao.com/install).

### Modified Files
\`\`\`
$(git diff --name-only HEAD~1)
\`\`\`

---
*Automated with enablerdao CLI*" \
      --repo "${ORG}/${_repo}" 2>/dev/null) || true

    if [ -n "${_pr_url}" ]; then
      echo ""
      printf "${BRIGHT_GREEN}  ╔══════════════════════════════════════════╗${RESET}\n"
      printf "${BRIGHT_GREEN}  ║${RESET}  ${CYAN}Pull Request Created!${RESET}                   ${BRIGHT_GREEN}║${RESET}\n"
      printf "${BRIGHT_GREEN}  ╚══════════════════════════════════════════╝${RESET}\n"
      echo ""
      success "PR URL: ${_pr_url}"
    else
      warn "Could not create PR automatically"
      step "Push succeeded. Create PR manually at:"
      step "https://github.com/${ORG}/${_repo}/pulls"
    fi
  else
    warn "GitHub CLI (gh) not installed. Pushing changes only."
    _branch=$(git branch --show-current)
    git push -u origin "${_branch}" 2>/dev/null || true
    step "Create PR manually at: https://github.com/${ORG}/${_repo}/pulls"
  fi
  echo ""
}

# ─── dev-status: Show working repos ───
cmd_dev_status() {
  echo ""
  printf "${BRIGHT_GREEN}  enablerdao dev-status${RESET}\n"
  printf "${DIM}  Workspace: ${WORKSPACE}${RESET}\n"
  echo ""

  if [ ! -d "${WORKSPACE}" ]; then
    warn "Workspace not found. Run 'enablerdao work <repo>' to get started."
    exit 0
  fi

  _count=0
  for _dir in "${WORKSPACE}"/*/; do
    [ -d "${_dir}/.git" ] || continue
    _name=$(basename "${_dir}")
    _count=$((_count + 1))

    cd "${_dir}"
    _branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    _changes=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    _last_commit=$(git log -1 --format='%ar' 2>/dev/null || echo "unknown")

    if [ "${_changes}" -gt 0 ] 2>/dev/null; then
      _status="${YELLOW}${_changes} uncommitted${RESET}"
    else
      _status="${GREEN}clean${RESET}"
    fi

    printf "  ${GREEN}%-20s${RESET} ${DIM}branch:${RESET}%-30s ${DIM}status:${RESET}${_status} ${DIM}(${_last_commit})${RESET}\n" \
      "${_name}" "${_branch}"
  done

  if [ "${_count}" -eq 0 ]; then
    printf "${DIM}  No repositories found in workspace.${RESET}\n"
    step "Run 'enablerdao work <repo>' to get started"
  else
    echo ""
    success "${_count} repository(ies) in workspace"
  fi
  echo ""
}

# ─── update: Self-update ───
cmd_update() {
  info "Updating enablerdao CLI..."
  if curl -fsSL https://enablerdao.com/install.sh | sh; then
    success "Updated to latest version"
  else
    errormsg "Update failed"
    exit 1
  fi
}

# ─── uninstall ───
cmd_uninstall() {
  echo ""
  warn "This will remove the enablerdao CLI."
  printf "  ${YELLOW}Continue? [y/N] ${RESET}"

  if [ -t 0 ]; then
    read -r _answer
    case "${_answer}" in
      [yY]|[yY][eE][sS]) ;;
      *)
        info "Cancelled."
        exit 0
        ;;
    esac
  else
    info "Non-interactive mode, skipping uninstall confirmation."
    exit 1
  fi

  _cli="${HOME}/.local/bin/enablerdao"
  if [ -f "$_cli" ]; then
    rm -f "$_cli"
    success "Removed ${_cli}"
  else
    warn "CLI not found at ${_cli}"
  fi

  # Also remove old enablerdao-dev if it exists
  _old_cli="${HOME}/.local/bin/enablerdao-dev"
  if [ -f "$_old_cli" ]; then
    rm -f "$_old_cli"
    success "Removed legacy ${_old_cli}"
  fi

  echo ""
  info "enablerdao CLI has been removed."
  info "Your workspace at ~/enablerdao-workspace/ was NOT removed."
  echo ""
}

# ═══════════════════════════════════════════════
# Main Router
# ═══════════════════════════════════════════════
case "${1:-}" in
  "")                        cmd_info ;;
  projects|p)                cmd_projects ;;
  status|s)                  cmd_status ;;
  docs|d)                    cmd_docs "$2" ;;
  token|t)                   cmd_token ;;
  repos|ls|list)             cmd_repos ;;
  work|w)                    cmd_work "$2" ;;
  pr)                        cmd_pr "$2" ;;
  dev-status|ds)             cmd_dev_status ;;
  update|up)                 cmd_update ;;
  uninstall|remove)          cmd_uninstall ;;
  version|v|-v|--version)    cmd_version ;;
  help|h|-h|--help)          cmd_help ;;
  *)
    errormsg "Unknown command: $1"
    echo ""
    cmd_help
    exit 1
    ;;
esac
CLIFILE

  chmod +x "${CLI_PATH}"
  success "Installed enablerdao to ${CLI_PATH}"
  echo ""

  # Also remove old enablerdao-dev if it exists and create a compatibility alias
  OLD_CLI="${CLI_DIR}/enablerdao-dev"
  if [ -f "${OLD_CLI}" ]; then
    rm -f "${OLD_CLI}"
    info "Removed legacy enablerdao-dev (replaced by enablerdao)"
  fi

  # Ensure ~/.local/bin is in PATH
  _path_added=0
  case ":${PATH}:" in
    *":${CLI_DIR}:"*) _path_added=1 ;;
  esac

  if [ "${_path_added}" -eq 0 ]; then
    warn "${CLI_DIR} is not in your PATH"
    echo ""
    info "Adding to your shell profile..."

    # Detect shell and add to appropriate rc file
    _shell_rc=""
    if [ -n "${ZSH_VERSION:-}" ] || [ "$(basename "${SHELL}")" = "zsh" ]; then
      _shell_rc="${HOME}/.zshrc"
    elif [ -n "${BASH_VERSION:-}" ] || [ "$(basename "${SHELL}")" = "bash" ]; then
      _shell_rc="${HOME}/.bashrc"
    fi

    if [ -n "${_shell_rc}" ]; then
      _path_line='export PATH="${HOME}/.local/bin:${PATH}"'
      if [ -f "${_shell_rc}" ] && grep -qF '.local/bin' "${_shell_rc}" 2>/dev/null; then
        success "PATH entry already exists in ${_shell_rc}"
      else
        echo "" >> "${_shell_rc}"
        echo "# EnablerDAO CLI" >> "${_shell_rc}"
        echo "${_path_line}" >> "${_shell_rc}"
        success "Added PATH to ${_shell_rc}"
        step "Run: source ${_shell_rc}"
      fi
    else
      step "Add this to your shell profile:"
      step "  export PATH=\"\${HOME}/.local/bin:\${PATH}\""
    fi

    # Also export for current session
    export PATH="${CLI_DIR}:${PATH}"
    echo ""
  fi
}

# ─────────────────────────────────────────────
# Success Message
# ─────────────────────────────────────────────
show_success() {
  echo ""
  printf "${BRIGHT_GREEN}  ╔══════════════════════════════════════════════════════╗${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}                                                      ${BRIGHT_GREEN}║${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}  ${CYAN}EnablerDAO CLI installed successfully!${RESET}              ${BRIGHT_GREEN}║${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}                                                      ${BRIGHT_GREEN}║${RESET}\n"
  printf "${BRIGHT_GREEN}  ╚══════════════════════════════════════════════════════╝${RESET}\n"
  echo ""
  printf "${DIM}  Quick start:${RESET}\n"
  printf "    ${GREEN}\$ enablerdao${RESET}                     ${DIM}# Welcome & info${RESET}\n"
  printf "    ${GREEN}\$ enablerdao projects${RESET}             ${DIM}# List all projects${RESET}\n"
  printf "    ${GREEN}\$ enablerdao status${RESET}               ${DIM}# Check service status${RESET}\n"
  printf "    ${GREEN}\$ enablerdao docs${RESET}                 ${DIM}# Open docs in browser${RESET}\n"
  printf "    ${GREEN}\$ enablerdao work <repo>${RESET}          ${DIM}# Fork, clone & start coding${RESET}\n"
  printf "    ${GREEN}\$ enablerdao help${RESET}                 ${DIM}# See all commands${RESET}\n"
  echo ""
  printf "${DIM}  Workspace: ~/enablerdao-workspace/${RESET}\n"
  printf "${DIM}  Docs:      https://enablerdao.com/install${RESET}\n"
  echo ""
}

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
main() {
  show_banner
  check_prerequisites
  install_cli
  show_success
}

main
