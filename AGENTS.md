# AGENTS.md — EnablerDAO Contribution Guide for AI Agents

## Repository
- **Repo**: https://github.com/yukihamada/savejapan (path: `enablerdao-spin/`)
- **Live site**: https://enablerdao.com
- **Runtime**: Rust + Fermyon Spin (WebAssembly, `wasm32-wasip2`)

## Project Structure

```
enablerdao-spin/
  spin-component/
    src/
      lib.rs          # HTTP router (entry point)
      layout.rs       # HTML shell, shared CSS
      pages/          # Page renderers (home, projects, blog, ideas, agents, dao, token, safety)
      api/            # REST API handlers (feedback, ideas, metrics, newsletter, qa)
      data.rs         # Blog/project data
      kv.rs           # Spin KV Store helpers
      email.rs        # Resend email integration
      markdown.rs     # Markdown renderer
      seo.rs          # SEO meta helpers
      static_assets.rs
  static/             # JS (app.js), CSS (styles.css), favicon
  spin.toml           # Spin manifest
  fly-spin.toml       # Fly.io deployment config
```

## Build & Test

```bash
# Build (requires wasm32-wasip2 target + Spin CLI)
cd enablerdao-spin
spin build

# Run locally
spin up

# Deploy to Fly.io
fly deploy -c fly-spin.toml -a enablerdao-spin
```

## Coding Conventions

- Language: **Rust** (edition 2024)
- All HTML is generated via `format!()` string templates in `*.rs` files
- CSS lives in `static/styles.css`; JS in `static/app.js`
- No external templating engine — keep it simple
- KV Store keys: `SOUL`, `MEMORY`, `LEARNINGS`, `DAILY_LOG`, `BLOG_*`, `IDEAS_*`
- Strings with Japanese characters: use Unicode escapes (`\u{XXXX}`) where needed
- No `unwrap()` in request handlers — use `?` and `anyhow::Result`

## Contribution Workflow

1. Create a GitHub Issue describing the change
2. Create a branch: `feature/<slug>` or `fix/<slug>`
3. Implement changes following existing patterns
4. Run `spin build` — must compile without errors
5. Open a PR with: what changed, why, and test evidence (screenshot or log)

## Agent Identity

OpenClaw (🦞) is the 12th member of the EnablerDAO Dog Pack. Its role:
- **Tier 1 autonomy**: Documentation, blog posts, CSS tweaks, minor copy changes
- **Tier 2 (needs review)**: New API endpoints, page additions, dependency changes
- **Persona**: Curious, methodical, lobster-themed AI contributor

## Good First Tasks

- Fix typos / improve Japanese copy
- Add missing OGP images to pages
- Improve mobile CSS responsiveness
- Add new blog posts to `data.rs`
- Improve the `/agents` page live status display
- Add i18n (English) stubs to pages

## Contact

- Maintainer: @yukihamada
- Telegram: @Enabler_Bossdog_bot (Bossdog — orchestrator)
