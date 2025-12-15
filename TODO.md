# Site Enhancement Roadmap

## Current Status

✅ **Complete:**
- Basic site setup (Minimal Light theme)
- Personal information & bio
- Research interests & affiliations
- Technical skills & languages
- Teaching & mentoring sections
- Research projects
- Open Graph tags (social sharing)
- JSON-LD structured data (SEO)
- Automated GitHub Actions workflows
- Commit message validation (no AI mentions)
- Custom dark mode favicon

## Next Steps

### Google Analytics Setup (Optional but Recommended)

**Why:** Track visitor behavior, traffic sources, popular pages, and device types

**Steps:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Create" → "Account"
4. Fill in account details:
   - Account name: "Henry Baker Portfolio"
   - Enable all recommended features
5. Create property:
   - Property name: "henrycgbaker.github.io"
   - Timezone: Europe/Berlin
   - Currency: EUR
6. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)
7. Edit `_config.yml`:
   ```yaml
   google_analytics: G-XXXXXXXXXX
   ```
8. Push to main - tracking starts immediately!

**View Analytics:**
- Real-time traffic: Reports → Realtime
- Page views: Reports → Pages and screens
- Traffic sources: Reports → Traffic source

---

### Stage 2: Contact Form

**What:** Allow visitors to send you messages directly

**Options:**
- **Formspree** (simplest, free tier available)
- **Basin.js** (minimal, lightweight)
- **Netlify Forms** (if hosting moves to Netlify)

**Time:** ~30 mins

---

### Stage 3: Site Search

**What:** Allow visitors to search your content

**Options:**
- **Lunr.js** (client-side, lightweight)
- **Jekyll search** (built-in plugin)
- **Google Custom Search** (free tier)

**Time:** ~1 hour

---

### Stage 4: Contact Form + Search

Both features together for complete visitor engagement

**Time:** ~1.5 hours

---

### Bonus Features

- [ ] Blog/Articles section (Markdown posts in `_posts/`)
- [ ] Publications section (with links to papers)
- [ ] Experience timeline (visual career progression)
- [ ] Custom domain (henrycgbaker.de or .com)
- [ ] Newsletter signup
- [ ] Dark mode toggle badge (visible button)
- [ ] Sitemap for search engines
- [ ] RSS feed for blog

---

## Files & Configuration

### Key Files

- `_config.yml` — Site configuration & metadata
- `index.md` — Homepage content
- `_layouts/homepage.html` — Custom layout with SEO
- `_includes/og-tags.html` — Social media preview tags
- `_includes/structured-data.html` — Google rich snippets
- `.git/hooks/commit-msg` — Prevents AI mentions in commits
- `.github/workflows/deploy.yml` — Auto-deployment
- `Gemfile` — Ruby dependencies

### GitHub Actions Workflows

- **deploy.yml** — Build & deploy on push to main
- **prettier.yml** — Auto-format code
- **broken-links.yml** — Check for broken links
- **lighthouse-badger.yml** — Performance & accessibility audits
- **update-citations.yml** — Sync Google Scholar citations

---

## Performance & SEO Checklist

- [x] Mobile responsive design
- [x] Fast page load (Jekyll static)
- [x] Open Graph tags (social sharing)
- [x] JSON-LD structured data (rich snippets)
- [x] SEO meta tags & keywords
- [x] Canonical URLs
- [x] Dark mode support
- [x] Accessible (semantic HTML, ARIA)
- [ ] Sitemap (easy to add)
- [ ] RSS feed (easy to add)
- [ ] Google Analytics tracking (ready, needs ID)
- [ ] Search functionality (planned)
- [ ] Contact form (planned)

---

## Quick Commands

```bash
# View site locally
bundle exec jekyll serve

# Deploy (automatic)
git add .
git commit -m "Your message"
git push origin main

# Check site status
open https://github.com/henrycgbaker/henrycgbaker.github.io/actions
```

---

## Notes

- Minimal Light theme is lightweight & fast
- All changes auto-deploy via GitHub Actions
- Commit hook prevents AI attribution mentions
- Custom layout extends (doesn't replace) remote theme
- Social media preview works on all major platforms

**Last Updated:** December 15, 2025
