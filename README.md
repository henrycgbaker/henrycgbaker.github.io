# Henry C G Baker — Professional Portfolio

[![Build Status](https://github.com/henrycgbaker/henrycgbaker.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/henrycgbaker/henrycgbaker.github.io/actions/workflows/deploy.yml)
[![License](https://img.shields.io/github/license/henrycgbaker/henrycgbaker.github.io)](LICENSE)

**Live site:** [henrycgbaker.github.io](https://henrycgbaker.github.io)

A professional academic portfolio website showcasing research interests, technical expertise, teaching contributions, and research projects. Built with Jekyll and the [Minimal Light](https://github.com/yaoyao-liu/minimal-light) theme.

## Site Structure

```
.
├── _config.yml                 # Main configuration (personal info, SEO)
├── index.md                    # Homepage content
├── Gemfile                     # Ruby dependencies (Jekyll 4.3)
│
├── # ─── Main Pages ───────────────────────────────────────────
├── research.md                 # Research landing page
├── teaching.md                 # Teaching & course materials
├── software.md                 # Software projects
├── experience.md               # Professional experience
├── contact.md                  # Contact information
│
├── # ─── Research Articles ────────────────────────────────────
├── research/
│   ├── llm-energy-efficiency/  # MDS thesis (2025)
│   │   ├── index.md           # Article page
│   │   └── figures/           # Visualisations
│   └── data-institutions/      # MPP thesis (2024)
│       └── index.md           # Article page
│
├── # ─── Source Materials ─────────────────────────────────────
├── _source/                    # LaTeX thesis sources (not deployed)
│   ├── llm-energy-efficiency/  # Full thesis .tex files & figures
│   └── data-institutions/      # Full thesis .tex files
│
├── # ─── Assets ───────────────────────────────────────────────
├── assets/
│   ├── files/
│   │   ├── cv.pdf             # Curriculum vitae
│   │   └── research/          # Thesis PDFs & posters
│   └── img/
│       ├── avatar.png         # Profile picture
│       ├── favicon.png        # Light mode icon
│       └── favicon-dark.png   # Dark mode icon
│
├── # ─── Automation ───────────────────────────────────────────
├── .github/workflows/          # Automated workflows
│   ├── deploy.yml             # Build and deploy to GitHub Pages
│   ├── prettier.yml           # Code formatting
│   ├── broken-links.yml       # Link validation
│   ├── lighthouse-badger.yml  # Performance & accessibility
│   └── update-citations.yml   # Auto-sync Google Scholar
└── .git/hooks/
    └── commit-msg             # Prevents AI attribution mentions
```

## Quick Start

### Prerequisites

- Ruby 3.3+
- Bundler

### Local Development

```bash
# Install dependencies
bundle install

# Build and serve locally
bundle exec jekyll serve

# Visit http://localhost:4000
```

### Editing Content

**Homepage:** Edit `index.md`
- About Me, Research Interests, Technical Skills, Affiliations

**Main pages:**
- `research.md` — Research overview and thesis summaries
- `teaching.md` — Courses and teaching materials
- `software.md` — Software projects and tools
- `experience.md` — Professional experience
- `contact.md` — Contact information

**Research articles:**
- `research/llm-energy-efficiency/index.md` — MDS thesis article
- `research/data-institutions/index.md` — MPP thesis article

**Site metadata:** Edit `_config.yml`

- Title, position, affiliation
- Links (GitHub, LinkedIn, CV, etc.)
- Avatar and favicon images
- Font preference (Serif/Sans Serif)
- Dark mode settings

**Profile picture:** Replace `assets/img/avatar.png`

**CV:** Replace `assets/files/cv.pdf`

## Deployment

Automatic deployment to GitHub Pages happens when you push to `main`:

```bash
git add .
git commit -m "Update content"
git push origin main
```

The deploy workflow will:

1. ✅ Check for AI attribution mentions
2. ✅ Build Jekyll site
3. ✅ Deploy to `gh-pages` branch
4. ✅ Live within 2-3 minutes

**Manual trigger:**
Go to [Actions → Deploy site → Run workflow](https://github.com/henrycgbaker/henrycgbaker.github.io/actions/workflows/deploy.yml)

## Automated Workflows

- **`deploy.yml`** — Builds and deploys site to GitHub Pages (runs on push to main)
- **`prettier.yml`** — Auto-formats code for consistency
- **`broken-links.yml`** — Scans site for broken links
- **`lighthouse-badger.yml`** — Performance, accessibility, and SEO audits
- **`update-citations.yml`** — Syncs Google Scholar citation counts daily

## Commit Hook

A git hook prevents commits that mention AI tools (e.g., "Claude", "Generated with"):

```bash
# This will be rejected:
git commit -m "Update with Claude's help"

# This will pass:
git commit -m "Update homepage content"
```

Hook location: `.git/hooks/commit-msg`

## Customization

### Colors & Styling

Edit `_sass/minimal-light.scss` for custom styles (theme is provided by remote theme)

### Typography

Change font in `_config.yml`:

```yaml
font: "Sans Serif" # or "Serif"
```

### Dark Mode

Disable auto-dark mode in `_config.yml`:

```yaml
auto_dark_mode: false
```

## Using a Custom Domain

To use a custom domain (e.g., `henrycgbaker.de`):

1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Add DNS records pointing to GitHub Pages:
   - Type A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or CNAME: `henrycgbaker.github.io`
3. Create `CNAME` file in repo root with your domain:
   ```
   henrycgbaker.de
   ```
4. Push and enable HTTPS in repo settings

See [GitHub Pages documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## Future Enhancements

- [x] Research articles section
- [x] Contact page
- [x] Site-wide search
- [ ] Blog/articles section
- [ ] Google Analytics setup
- [ ] Publications section with citations
- [ ] Experience timeline/map visualisation

## Theme

Built on [Minimal Light](https://github.com/yaoyao-liu/minimal-light) by Yaoyao Liu — a clean, elegant Jekyll theme for academic portfolios.

## License

This work is licensed under the [Creative Commons Zero v1.0 Universal](LICENSE) License.
