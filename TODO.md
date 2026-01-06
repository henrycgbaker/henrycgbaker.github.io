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
- Contact form page (requires Formspree setup)
- Site search with Lunr.js
- Custom page layout with navigation

## YOUR ACTION ITEMS 🚀

### 1. **Setup Formspree for Contact Form** ⏱️ 5 mins

**Status:** ⏳ Needs your action

**Why:** Allows visitors to email you through the contact form

**Steps:**

1. Go to: https://formspree.io/
2. Sign up (free) with your email
3. Create a new form:
   - Click "Create" or "New Form"
   - Enter form name: `Contact Form`
4. You'll get a **Form ID** (like: `f1a2b3c4`)
5. Edit `contact.md` and find this line:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"></form>
   ```
   Replace `YOUR_FORM_ID` with your actual form ID:
   ```html
   <form action="https://formspree.io/f/f1a2b3c4" method="POST"></form>
   ```
6. Push to main - contact form is live!

**Add to TODO.md once done:**

- [ ] Formspree setup complete (add ID to contact.md)

---

### 2. **Google Analytics Setup** ⏱️ 5 mins

**Status:** ⏳ Needs your action

**See:** `GOOGLE-ANALYTICS-SETUP.md` for detailed instructions

**Quick steps:**

1. Go to https://analytics.google.com/
2. Create account and property
3. Get your Measurement ID (`G-XXXXXXXXXX`)
4. Add to `_config.yml`:
   ```yaml
   google_analytics: G-XXXXXXXXXX
   ```
5. Push - tracking starts immediately

**Add to TODO.md once done:**

- [ ] Google Analytics ID added to \_config.yml

---

### 3. **Expand Research Landing Pages** 🔬

**Status:** ⏳ Basic scaffolding complete - expand when ready

**Current state:** Landing pages at `/research/llm-energy-efficiency/` and `/research/data-institutions/` have moderate-depth content extracted from thesis LaTeX sources.

**Future enhancements:**

- [ ] **LLM Energy Efficiency page:**
  - [ ] Add more figures from `_source/llm-energy-efficiency/figures/` (47 available)
  - [ ] Create interactive visualisations (D3.js/Plotly)
  - [ ] Add Jupyter notebooks demonstrating the measurement tool
  - [ ] Link to live demos or hosted notebook environments
  - [ ] Expand methodology section with code examples
  - [ ] Add comparison tables for different model configurations

- [ ] **Data Institutions page:**
  - [ ] Add case study visualisations
  - [ ] Create policy framework diagrams
  - [ ] Add interactive elements for the 9 principles
  - [ ] Link to related organisations (ODI, Data Trusts Initiative, etc.)

**Resources available:**
- LaTeX sources in `_source/` with full thesis text
- 47 figures for LLM thesis in `_source/llm-energy-efficiency/figures/`
- GitHub repo: https://github.com/henrycgbaker/llm-efficiency-measurement-tool

---

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
- `contact.md` — Contact form (needs Formspree setup)
- `search.md` — Site search with Lunr.js
- `_layouts/homepage.html` — Custom layout with SEO (homepage)
- `_layouts/page.html` — Custom layout with navigation (contact/search)
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
- [x] Search functionality (Lunr.js)
- [x] Contact form (Formspree integration ready)
- [ ] Google Analytics tracking (ready, needs your GA ID)
- [ ] Sitemap (easy to add)
- [ ] RSS feed (easy to add)

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

---

## Known Issues (Disabled for Now)

### Subpage Styling Consistency

- [ ] **STATUS:** ⏳ Disabled - investigate when time permits
- **Details:** Pages using remote theme layouts (Contact, Search, Experience, Publications, Blog) display inconsistently with homepage
- **Observation:** Dark mode CSS applies globally but typography/spacing differs per page
- **Why disabled:** Requires either full layout customization or accepting theme defaults; not critical for functionality
- **Next steps:** Revisit when styling refinements are desired

### GitHub Actions - Prettier Formatter

- [x] **FIXED:** Added `.prettierignore` to exclude `_layouts/` and `_includes/` from Prettier checks
- **Problem was:** Prettier couldn't parse Jekyll template syntax like `{{ site.lang | default: "..." }}`
- **Solution:** Excluded template files that contain Jinja/Liquid syntax

---

**Last Updated:** January 6, 2026
