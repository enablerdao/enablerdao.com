# Fly.io Deployment Guide - enablerdao.com

This guide walks you through deploying the EnablerDAO website to Fly.io.

## Prerequisites

- Fly.io account (free tier available)
- Fly.io CLI installed
- Git repository access
- Domain access (enablerdao.com)

## 1. Install Fly.io CLI

### macOS
```bash
brew install flyctl
```

### Linux
```bash
curl -L https://fly.io/install.sh | sh
```

### Windows (PowerShell)
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

## 2. Login to Fly.io

```bash
fly auth login
```

This opens a browser window for authentication.

## 3. Initial Setup (First Time Only)

If deploying for the first time, launch the app:

```bash
cd /Users/yuki/workspace/savejapan/d-enablerdao
fly launch
```

Answer the prompts:
- **App name**: `enablerdao` (or choose another unique name)
- **Region**: `nrt` (Tokyo - for lowest latency)
- **PostgreSQL**: No (not needed for this static site)
- **Redis**: No (not needed)

The `fly.toml` file is already configured, so it will use those settings.

## 4. Set Environment Variables

Set required secrets (these are encrypted and not visible in logs):

```bash
# Resend API Key (for contact form emails)
fly secrets set RESEND_API_KEY="re_your_actual_api_key_here"

# Google Analytics (optional)
fly secrets set NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Newsletter feature toggle
fly secrets set NEXT_PUBLIC_NEWSLETTER_ENABLED="true"
```

To view current secrets (values are hidden):
```bash
fly secrets list
```

To remove a secret:
```bash
fly secrets unset SECRET_NAME
```

## 5. Deploy the Application

### Standard Deployment
```bash
fly deploy
```

Or use the npm script:
```bash
npm run deploy:fly
```

### First Deployment
The first deployment may take 5-10 minutes as it:
1. Builds the Docker image
2. Pushes to Fly.io registry
3. Creates VM instances
4. Runs health checks

### Subsequent Deployments
Later deployments are faster (2-3 minutes) due to layer caching.

## 6. Custom Domain Setup

### Add Domain to Fly.io
```bash
# Add the domain
fly certs add enablerdao.com

# Add www subdomain
fly certs add www.enablerdao.com
```

### Configure DNS Records

Add these records in your domain registrar (e.g., Cloudflare, Route53):

**A Record:**
```
Type: A
Name: @
Value: [IP shown in fly certs show enablerdao.com]
Proxy: No (DNS only)
TTL: Auto
```

**CNAME Record (for www):**
```
Type: CNAME
Name: www
Value: enablerdao.fly.dev
Proxy: No (DNS only)
TTL: Auto
```

### Check Certificate Status
```bash
fly certs show enablerdao.com
```

Wait for status to show "Ready". This takes 1-5 minutes after DNS propagation.

### SSL Certificate
Fly.io automatically provisions Let's Encrypt SSL certificates. No manual configuration needed.

## 7. Scaling Configuration

### View Current Status
```bash
fly status
```

### Scale VM Count
```bash
# Minimum 1 VM (always running)
fly scale count 1

# Scale to 3 VMs for high traffic
fly scale count 3
```

### Scale VM Resources
```bash
# Shared CPU with 512MB RAM (default)
fly scale vm shared-cpu-1x --memory 512

# Upgrade to 1GB RAM
fly scale vm shared-cpu-1x --memory 1024
```

### Auto-scaling Configuration
Edit `fly.toml` to adjust auto-scaling:
```toml
[http_service]
  min_machines_running = 1  # Always keep 1 running
  auto_stop_machines = 'stop'
  auto_start_machines = true
```

## 8. Monitoring and Logs

### View Real-time Logs
```bash
fly logs
```

Or use the npm script:
```bash
npm run logs:fly
```

### View Logs from Specific Region
```bash
fly logs --region nrt
```

### View Last 100 Lines
```bash
fly logs --limit 100
```

### Monitor Application
```bash
fly status
fly monitor
```

### Dashboard
Visit the web dashboard:
```bash
fly dashboard
```

Or directly: https://fly.io/apps/enablerdao

## 9. Common Commands

### SSH into VM
```bash
fly ssh console
```

### Restart Application
```bash
fly apps restart enablerdao
```

### Open Application
```bash
fly open
```

### Check VM Status
```bash
fly vm status
```

### View Configuration
```bash
fly config show
```

## 10. Rollback

If a deployment has issues, rollback to previous version:

```bash
# List recent releases
fly releases

# Rollback to specific version (e.g., v5)
fly releases rollback v5
```

## 11. CI/CD Integration (Optional)

### GitHub Actions

Create `.github/workflows/fly-deploy.yml`:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Flyctl
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Generate API token:
```bash
fly tokens create deploy
```

Add the token to GitHub repository secrets as `FLY_API_TOKEN`.

## 12. Cost Optimization

### Free Tier Limits
- 3 shared-cpu-1x VMs (256MB RAM each)
- 160GB bandwidth/month
- Auto-stop for inactive apps

### Current Configuration
- **VM**: 1x shared-cpu-1x (512MB RAM)
- **Region**: nrt (Tokyo)
- **Cost**: ~$5-10/month (with 1 VM always running)

### Cost Reduction
To use free tier:
```bash
# Scale to free tier specs
fly scale vm shared-cpu-1x --memory 256
fly scale count 1
```

Set `min_machines_running = 0` in `fly.toml` to allow auto-stop (but this adds cold-start latency).

## 13. Troubleshooting

### Build Fails
```bash
# Check build logs
fly logs --level error

# Try local build
docker build -t enablerdao .
docker run -p 3000:3000 enablerdao
```

### Health Check Fails
- Check `http_service.checks.path` in `fly.toml`
- Ensure the app listens on `0.0.0.0:3000`
- Increase `grace_period` if app takes time to start

### DNS Not Resolving
```bash
# Check DNS propagation
dig enablerdao.com

# Verify Fly.io sees correct IP
fly certs check enablerdao.com
```

### Application Crashes
```bash
# Check logs
fly logs

# SSH into VM
fly ssh console

# Check process status
ps aux | grep node
```

## 14. Production Checklist

Before going live:

- [ ] Environment variables set (`fly secrets list`)
- [ ] Custom domain configured (`fly certs show enablerdao.com`)
- [ ] SSL certificate ready (status: Ready)
- [ ] Health checks passing (`fly status`)
- [ ] Logs clean with no errors (`fly logs`)
- [ ] Performance tested (load time < 2s)
- [ ] Analytics tracking works (GA4)
- [ ] Contact form tested (email delivery)
- [ ] Mobile responsive (test on devices)
- [ ] SEO meta tags present (view source)

## 15. Support Resources

- **Fly.io Docs**: https://fly.io/docs/
- **Community Forum**: https://community.fly.io/
- **Status Page**: https://status.flyio.net/
- **Pricing**: https://fly.io/docs/about/pricing/

## Quick Reference

```bash
# Deploy
fly deploy

# Logs
fly logs

# Status
fly status

# Scale
fly scale count 3

# Restart
fly apps restart

# SSH
fly ssh console

# Rollback
fly releases rollback vN
```

---

**Last Updated**: 2026-02-14
**Maintainer**: Yuki Hamada
**App Name**: enablerdao
**Region**: nrt (Tokyo)
