# EnablerDAO

**Empowering Grappling Athletes Worldwide**

EnablerDAO is a decentralized platform connecting BJJ/柔術 athletes, sponsors, and fans through Web3 technology.

🌐 **Live**: [enablerdao.com](https://enablerdao.com)

---

## Features

- **Newsletter Subscription**: Stay updated with latest news
- **Responsive Design**: Mobile-first, dark theme
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Analytics**: Google Analytics 4 integration
- **Email Integration**: Resend API for transactional emails

---

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3, Tailwind CSS 4
- **Email**: Resend API
- **Deployment**: Cloudflare Pages
- **Language**: TypeScript 5

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, pnpm, or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yukihamada/d-enablerdao.git
cd d-enablerdao

# Install dependencies
npm install
```

### Environment Variables

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_NEWSLETTER_ENABLED=true
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Cloudflare Pages (Recommended)

```bash
# Install Cloudflare dependencies
npm install -D @cloudflare/next-on-pages wrangler

# Build for Cloudflare Pages
npm run pages:build

# Deploy
npm run deploy
```

**Quick Setup**: See [docs/CLOUDFLARE_QUICKSTART.md](./docs/CLOUDFLARE_QUICKSTART.md)

**Full Guide**: See [docs/DEPLOY_CLOUDFLARE.md](./docs/DEPLOY_CLOUDFLARE.md)

**GitHub Actions**: See [docs/GITHUB_ACTIONS_SETUP.md](./docs/GITHUB_ACTIONS_SETUP.md)

### Fly.io (Alternative)

```bash
# Deploy to Fly.io
npm run deploy:fly
```

---

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "pages:build": "npx @cloudflare/next-on-pages",
  "preview": "npm run pages:build && wrangler pages dev",
  "deploy": "npm run pages:build && wrangler pages deploy",
  "cf:dev": "wrangler pages dev .vercel/output/static"
}
```

---

## Project Structure

```
d-enablerdao/
├── src/
│   ├── app/
│   │   ├── api/          # API routes (Edge Runtime)
│   │   ├── page.tsx      # Home page
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   └── types/            # TypeScript types
├── public/               # Static assets
├── docs/                 # Documentation
│   ├── DEPLOY_CLOUDFLARE.md
│   ├── CLOUDFLARE_QUICKSTART.md
│   └── GITHUB_ACTIONS_SETUP.md
├── .github/
│   └── workflows/
│       └── cloudflare-pages.yml
├── next.config.ts        # Next.js configuration
├── wrangler.toml         # Cloudflare configuration
└── package.json
```

---

## API Routes

All API routes use **Edge Runtime** for Cloudflare Pages compatibility:

```typescript
export const runtime = 'edge';
```

- `POST /api/newsletter/subscribe` - Newsletter subscription
- `POST /api/email/webhook` - Email webhook handler
- `GET /api/verify/domain/check` - Domain verification
- `GET /api/verify/github/check` - GitHub verification

---

## Security

- **CSP**: Content Security Policy headers
- **HSTS**: Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **Secrets**: Environment variables stored securely

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## License

MIT License - See [LICENSE](./LICENSE) for details

---

## Author

**Yuki Hamada**

- GitHub: [@yukihamada](https://github.com/yukihamada)
- Website: [yukihamada.jp](https://yukihamada.jp)

---

**Built with 💜 for the Grappling Community**
