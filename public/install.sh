#!/bin/sh
# EnablerDAO Dev Kit Installer
# Usage: curl -fsSL https://enablerdao.com/install.sh | sh
#
# This script installs the enablerdao-dev CLI tool which uses
# Claude Code to develop and contribute to EnablerDAO projects.

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

spinner() {
  _pid=$1
  _chars='|/-\'
  _i=0
  while kill -0 "$_pid" 2>/dev/null; do
    _i=$(( (_i + 1) % 4 ))
    printf "\r${DIM}    %s${RESET}" "$(echo "$_chars" | cut -c$((_i+1))-$((_i+1)))"
    sleep 0.1
  done
  printf "\r"
}

progress_bar() {
  _current=$1
  _total=$2
  _width=30
  _filled=$(( _current * _width / _total ))
  _empty=$(( _width - _filled ))
  _bar=""
  _j=0
  while [ $_j -lt $_filled ]; do
    _bar="${_bar}#"
    _j=$((_j + 1))
  done
  _j=0
  while [ $_j -lt $_empty ]; do
    _bar="${_bar}-"
    _j=$((_j + 1))
  done
  printf "\r  ${DIM}[${GREEN}%s${DIM}]${RESET} %d/%d" "$_bar" "$_current" "$_total"
}

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
  printf "${CYAN}        Dev Kit Installer — Powered by Claude Code${RESET}\n"
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
  _total=4

  # 1. git
  if command -v git >/dev/null 2>&1; then
    success "git $(git --version | sed 's/git version //')"
    _ok=$((_ok + 1))
  else
    error "git is not installed"
    step "Install: https://git-scm.com/downloads"
  fi
  progress_bar $_ok $_total
  echo ""

  # 2. node
  if command -v node >/dev/null 2>&1; then
    _node_ver=$(node --version)
    success "node ${_node_ver}"
    _ok=$((_ok + 1))
  else
    error "node is not installed"
    step "Install: https://nodejs.org/ (v18+ recommended)"
    step "Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"
  fi
  progress_bar $_ok $_total
  echo ""

  # 3. npm or bun
  if command -v bun >/dev/null 2>&1; then
    success "bun $(bun --version)"
    PKG_MANAGER="bun"
    PKG_INSTALL="bun install -g"
    _ok=$((_ok + 1))
  elif command -v npm >/dev/null 2>&1; then
    success "npm $(npm --version)"
    PKG_MANAGER="npm"
    PKG_INSTALL="npm install -g"
    _ok=$((_ok + 1))
  else
    error "npm/bun is not installed"
    step "npm comes with Node.js: https://nodejs.org/"
    step "Or install bun: curl -fsSL https://bun.sh/install | bash"
  fi
  progress_bar $_ok $_total
  echo ""

  # 4. claude (Claude Code CLI)
  if command -v claude >/dev/null 2>&1; then
    success "claude (Claude Code CLI) found"
    _ok=$((_ok + 1))
  else
    warn "claude (Claude Code CLI) not found — will install"
    NEEDS_CLAUDE=1
  fi
  progress_bar $_ok $_total
  echo ""
  echo ""

  if [ $_ok -lt 3 ]; then
    error "Missing critical prerequisites. Please install the above tools first."
    echo ""
    info "Quick setup guide:"
    step "macOS:  brew install git node"
    step "Ubuntu: sudo apt update && sudo apt install -y git nodejs npm"
    step "More:   https://enablerdao.com/install"
    echo ""
    exit 1
  fi

  success "Prerequisite check passed (${_ok}/${_total})"
  echo ""
}

# ─────────────────────────────────────────────
# Install Claude Code CLI
# ─────────────────────────────────────────────
install_claude() {
  if [ "${NEEDS_CLAUDE:-0}" = "1" ]; then
    info "Installing Claude Code CLI..."
    step "Running: ${PKG_INSTALL} @anthropic-ai/claude-code"
    echo ""

    if ${PKG_INSTALL} @anthropic-ai/claude-code >/dev/null 2>&1; then
      success "Claude Code CLI installed successfully"
    else
      warn "Global install failed, trying with sudo..."
      if sudo ${PKG_INSTALL} @anthropic-ai/claude-code >/dev/null 2>&1; then
        success "Claude Code CLI installed successfully (via sudo)"
      else
        error "Failed to install Claude Code CLI"
        step "Try manually: ${PKG_INSTALL} @anthropic-ai/claude-code"
        exit 1
      fi
    fi
    echo ""
  fi
}

# ─────────────────────────────────────────────
# Create Workspace
# ─────────────────────────────────────────────
setup_workspace() {
  WORKSPACE_DIR="${HOME}/enablerdao-workspace"

  if [ ! -d "${WORKSPACE_DIR}" ]; then
    info "Creating workspace directory..."
    mkdir -p "${WORKSPACE_DIR}"
    success "Created ${WORKSPACE_DIR}"
  else
    success "Workspace already exists: ${WORKSPACE_DIR}"
  fi
  echo ""
}

# ─────────────────────────────────────────────
# Install enablerdao-dev CLI
# ─────────────────────────────────────────────
install_cli() {
  info "Installing enablerdao-dev CLI..."

  CLI_DIR="${HOME}/.local/bin"
  CLI_PATH="${CLI_DIR}/enablerdao-dev"

  mkdir -p "${CLI_DIR}"

  cat > "${CLI_PATH}" << 'CLIFILE'
#!/bin/sh
# enablerdao-dev — EnablerDAO Development CLI
# Powered by Claude Code

set -e

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

info()    { printf "${CYAN}[INFO]${RESET} %s\n" "$1"; }
success() { printf "${GREEN}[ OK ]${RESET} %s\n" "$1"; }
warn()    { printf "${YELLOW}[WARN]${RESET} %s\n" "$1"; }
error()   { printf "${RED}[FAIL]${RESET} %s\n" "$1"; }
step()    { printf "${BRIGHT_GREEN}  >>> ${RESET}%s\n" "$1"; }

show_help() {
  printf "${BRIGHT_GREEN}"
  echo "  enablerdao-dev — EnablerDAO Development CLI"
  printf "${RESET}"
  echo ""
  printf "${CYAN}USAGE:${RESET}\n"
  echo "  enablerdao-dev <command> [args]"
  echo ""
  printf "${CYAN}COMMANDS:${RESET}\n"
  printf "  ${GREEN}list${RESET}              List EnablerDAO repositories\n"
  printf "  ${GREEN}work${RESET} <repo>       Fork & clone a repo, then start Claude Code\n"
  printf "  ${GREEN}pr${RESET}   <repo>       Commit changes and create a Pull Request\n"
  printf "  ${GREEN}status${RESET}            Show repos you are currently working on\n"
  printf "  ${GREEN}update${RESET}            Update enablerdao-dev to the latest version\n"
  printf "  ${GREEN}help${RESET}              Show this help message\n"
  echo ""
  printf "${CYAN}EXAMPLES:${RESET}\n"
  printf "  ${DIM}\$ enablerdao-dev list${RESET}\n"
  printf "  ${DIM}\$ enablerdao-dev work OptimaChain${RESET}\n"
  printf "  ${DIM}\$ enablerdao-dev pr OptimaChain${RESET}\n"
  echo ""
  printf "${DIM}Workspace: ${WORKSPACE}${RESET}\n"
  printf "${DIM}Docs:      https://enablerdao.com/install${RESET}\n"
  echo ""
}

# ─── list: Show enablerdao repos ───
cmd_list() {
  info "Fetching EnablerDAO repositories..."
  echo ""

  if command -v gh >/dev/null 2>&1; then
    printf "${DIM}  %-28s %-8s %s${RESET}\n" "REPOSITORY" "STARS" "DESCRIPTION"
    printf "${DIM}  %-28s %-8s %s${RESET}\n" "----------------------------" "--------" "-----------------------------------"
    gh api "orgs/${ORG}/repos?per_page=100&sort=updated" --paginate --jq '.[] | "  \(.name)\t\(.stargazers_count)\t\(.description // "-")"' 2>/dev/null | while IFS="$(printf '\t')" read -r name stars desc; do
      printf "${GREEN}%-30s${RESET} ${YELLOW}%-8s${RESET} ${DIM}%s${RESET}\n" "$name" "$stars" "$desc"
    done
  else
    warn "GitHub CLI (gh) not found. Showing cached list of popular repos."
    echo ""
    printf "${DIM}  %-28s %s${RESET}\n" "REPOSITORY" "DESCRIPTION"
    printf "${DIM}  %-28s %s${RESET}\n" "----------------------------" "-----------------------------------"
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
  step "To start working: enablerdao-dev work <repo-name>"
  echo ""
}

# ─── work: Fork, clone, and start Claude Code ───
cmd_work() {
  _repo="$1"
  if [ -z "$_repo" ]; then
    error "Repository name required"
    step "Usage: enablerdao-dev work <repo-name>"
    step "Run 'enablerdao-dev list' to see available repos"
    exit 1
  fi

  REPO_DIR="${WORKSPACE}/${_repo}"

  echo ""
  printf "${BRIGHT_GREEN}  ╔══════════════════════════════════════════╗${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}  Starting work on ${CYAN}${ORG}/${_repo}${RESET}${BRIGHT_GREEN}$(printf '%*s' $((20 - ${#_repo})) '')║${RESET}\n"
  printf "${BRIGHT_GREEN}  ╚══════════════════════════════════════════╝${RESET}\n"
  echo ""

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
  _branch="dev/claude-$(date +%Y%m%d-%H%M%S)"
  git checkout -b "${_branch}" 2>/dev/null || true
  success "Created branch: ${_branch}"
  echo ""

  # Launch Claude Code
  info "Launching Claude Code..."
  step "Working directory: ${REPO_DIR}"
  step "Branch: ${_branch}"
  echo ""
  printf "${BRIGHT_GREEN}  ┌─────────────────────────────────────────┐${RESET}\n"
  printf "${BRIGHT_GREEN}  │${RESET}  ${CYAN}Claude Code is starting...${RESET}              ${BRIGHT_GREEN}│${RESET}\n"
  printf "${BRIGHT_GREEN}  │${RESET}  ${DIM}Type your task and let AI handle it.${RESET}    ${BRIGHT_GREEN}│${RESET}\n"
  printf "${BRIGHT_GREEN}  │${RESET}  ${DIM}When done: enablerdao-dev pr ${_repo}${RESET}$(printf '%*s' $((8 - ${#_repo})) '')${BRIGHT_GREEN}│${RESET}\n"
  printf "${BRIGHT_GREEN}  └─────────────────────────────────────────┘${RESET}\n"
  echo ""

  cd "${REPO_DIR}"
  if command -v claude >/dev/null 2>&1; then
    claude
  else
    error "Claude Code CLI not found"
    step "Install: npm install -g @anthropic-ai/claude-code"
    exit 1
  fi
}

# ─── pr: Commit and create PR ───
cmd_pr() {
  _repo="$1"
  if [ -z "$_repo" ]; then
    error "Repository name required"
    step "Usage: enablerdao-dev pr <repo-name>"
    exit 1
  fi

  REPO_DIR="${WORKSPACE}/${_repo}"

  if [ ! -d "${REPO_DIR}" ]; then
    error "Repository not found at ${REPO_DIR}"
    step "Run 'enablerdao-dev work ${_repo}' first"
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
    _commit_msg=$(claude --print "Generate a concise git commit message (1 line, max 72 chars) for these changes: ${_diff}" 2>/dev/null || echo "feat: update ${_repo} via EnablerDAO Dev Kit")
  else
    _commit_msg="feat: update ${_repo} via EnablerDAO Dev Kit"
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

This PR was created using [EnablerDAO Dev Kit](https://enablerdao.com/install) powered by Claude Code.

### Modified Files
\`\`\`
$(git diff --name-only HEAD~1)
\`\`\`

---
*Automated with enablerdao-dev CLI*" \
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

# ─── status: Show working repos ───
cmd_status() {
  echo ""
  printf "${BRIGHT_GREEN}  enablerdao-dev status${RESET}\n"
  printf "${DIM}  Workspace: ${WORKSPACE}${RESET}\n"
  echo ""

  if [ ! -d "${WORKSPACE}" ]; then
    warn "Workspace not found. Run 'enablerdao-dev work <repo>' to get started."
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
    step "Run 'enablerdao-dev work <repo>' to get started"
  else
    echo ""
    success "${_count} repository(ies) in workspace"
  fi
  echo ""
}

# ─── update: Self-update ───
cmd_update() {
  info "Updating enablerdao-dev..."
  if curl -fsSL https://enablerdao.com/install.sh | sh; then
    success "Updated to latest version"
  else
    error "Update failed"
    exit 1
  fi
}

# ─── Main ───
case "${1:-help}" in
  list|ls)       cmd_list ;;
  work|w)        cmd_work "$2" ;;
  pr)            cmd_pr "$2" ;;
  status|st)     cmd_status ;;
  update|up)     cmd_update ;;
  help|--help|-h)show_help ;;
  *)
    error "Unknown command: $1"
    echo ""
    show_help
    exit 1
    ;;
esac
CLIFILE

  chmod +x "${CLI_PATH}"
  success "Installed enablerdao-dev to ${CLI_PATH}"
  echo ""

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
    if [ -n "${ZSH_VERSION}" ] || [ "$(basename "${SHELL}")" = "zsh" ]; then
      _shell_rc="${HOME}/.zshrc"
    elif [ -n "${BASH_VERSION}" ] || [ "$(basename "${SHELL}")" = "bash" ]; then
      _shell_rc="${HOME}/.bashrc"
    fi

    if [ -n "${_shell_rc}" ]; then
      _path_line='export PATH="${HOME}/.local/bin:${PATH}"'
      if [ -f "${_shell_rc}" ] && grep -qF '.local/bin' "${_shell_rc}" 2>/dev/null; then
        success "PATH entry already exists in ${_shell_rc}"
      else
        echo "" >> "${_shell_rc}"
        echo "# EnablerDAO Dev Kit" >> "${_shell_rc}"
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
# Interactive Repo Selection
# ─────────────────────────────────────────────
select_repo() {
  echo ""
  printf "${CYAN}  Popular EnablerDAO repositories:${RESET}\n"
  echo ""
  printf "  ${GREEN} 1)${RESET} OptimaChain      ${DIM}— Next-gen blockchain platform${RESET}\n"
  printf "  ${GREEN} 2)${RESET} HyperFlux        ${DIM}— High-performance system${RESET}\n"
  printf "  ${GREEN} 3)${RESET} ShardX           ${DIM}— Sharding framework${RESET}\n"
  printf "  ${GREEN} 4)${RESET} NexaCore         ${DIM}— Core infrastructure${RESET}\n"
  printf "  ${GREEN} 5)${RESET} NeuraChain       ${DIM}— AI-powered chain${RESET}\n"
  printf "  ${GREEN} 6)${RESET} NovaLedger       ${DIM}— Distributed ledger${RESET}\n"
  printf "  ${GREEN} 7)${RESET} PulseChain       ${DIM}— Real-time chain${RESET}\n"
  printf "  ${GREEN} 8)${RESET} Aiden            ${DIM}— AI development environment${RESET}\n"
  printf "  ${GREEN} 9)${RESET} GeneLLM          ${DIM}— Gene-based LLM${RESET}\n"
  printf "  ${GREEN}10)${RESET} NexOS            ${DIM}— Next-gen OS${RESET}\n"
  printf "  ${GREEN}11)${RESET} enabler          ${DIM}— Core enabler module${RESET}\n"
  printf "  ${GREEN}12)${RESET} timedrop         ${DIM}— Time-based distribution${RESET}\n"
  printf "  ${GREEN}13)${RESET} stayflow         ${DIM}— Stay management${RESET}\n"
  printf "  ${GREEN}14)${RESET} Synexia          ${DIM}— Synergy platform${RESET}\n"
  printf "  ${GREEN}15)${RESET} pocketai         ${DIM}— Pocket AI assistant${RESET}\n"
  echo ""
  printf "  ${DIM}Or type a repo name directly.${RESET}\n"
  echo ""
  printf "${BRIGHT_GREEN}  > ${RESET}Select a repo [1-15 or name]: "

  read -r _choice
  case "${_choice}" in
    1)  SELECTED_REPO="OptimaChain" ;;
    2)  SELECTED_REPO="HyperFlux" ;;
    3)  SELECTED_REPO="ShardX" ;;
    4)  SELECTED_REPO="NexaCore" ;;
    5)  SELECTED_REPO="NeuraChain" ;;
    6)  SELECTED_REPO="NovaLedger" ;;
    7)  SELECTED_REPO="PulseChain" ;;
    8)  SELECTED_REPO="Aiden" ;;
    9)  SELECTED_REPO="GeneLLM" ;;
    10) SELECTED_REPO="NexOS" ;;
    11) SELECTED_REPO="enabler" ;;
    12) SELECTED_REPO="timedrop" ;;
    13) SELECTED_REPO="stayflow" ;;
    14) SELECTED_REPO="Synexia" ;;
    15) SELECTED_REPO="pocketai" ;;
    "")
      warn "No selection made. You can start later with: enablerdao-dev work <repo>"
      return 1
      ;;
    *)  SELECTED_REPO="${_choice}" ;;
  esac
  return 0
}

# ─────────────────────────────────────────────
# Success Message
# ─────────────────────────────────────────────
show_success() {
  echo ""
  printf "${BRIGHT_GREEN}  ╔══════════════════════════════════════════════════════╗${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}                                                      ${BRIGHT_GREEN}║${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}  ${CYAN}EnablerDAO Dev Kit installed successfully!${RESET}          ${BRIGHT_GREEN}║${RESET}\n"
  printf "${BRIGHT_GREEN}  ║${RESET}                                                      ${BRIGHT_GREEN}║${RESET}\n"
  printf "${BRIGHT_GREEN}  ╚══════════════════════════════════════════════════════╝${RESET}\n"
  echo ""
  printf "${DIM}  Quick start:${RESET}\n"
  printf "    ${GREEN}\$ enablerdao-dev list${RESET}            ${DIM}# Show all repos${RESET}\n"
  printf "    ${GREEN}\$ enablerdao-dev work <repo>${RESET}     ${DIM}# Fork, clone & start coding${RESET}\n"
  printf "    ${GREEN}\$ enablerdao-dev pr <repo>${RESET}       ${DIM}# Create a Pull Request${RESET}\n"
  printf "    ${GREEN}\$ enablerdao-dev status${RESET}          ${DIM}# Check your workspace${RESET}\n"
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
  install_claude
  setup_workspace
  install_cli
  show_success

  # Interactive: ask if user wants to start working on a repo now
  if [ -t 0 ]; then
    printf "${CYAN}  Would you like to start working on a repository now? [Y/n] ${RESET}"
    read -r _answer
    case "${_answer}" in
      [nN]|[nN][oO])
        info "No worries! Run 'enablerdao-dev work <repo>' anytime."
        echo ""
        ;;
      *)
        if select_repo; then
          echo ""
          success "Selected: ${SELECTED_REPO}"
          echo ""
          # Use the installed CLI to start working
          "${HOME}/.local/bin/enablerdao-dev" work "${SELECTED_REPO}"
        fi
        ;;
    esac
  fi
}

main
