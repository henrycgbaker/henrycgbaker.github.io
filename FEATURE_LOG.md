# Feature Test & Validation Log

Last Updated: 2025-12-15

---

## Core Pages

### Homepage
- [ ] Page loads at `/` (root)
- [ ] About section displays correctly
- [ ] Research Interests section visible
- [ ] Affiliations listed with clickable links
- [ ] Technical Skills section shows languages and frameworks
- [ ] Teaching & Mentoring section displays courses
- [ ] Research Projects section lists projects with descriptions
- [ ] "Explore" section visible at bottom with navigation links

### Experience Timeline
- [ ] Page loads at `/experience/`
- [ ] Visual timeline displays correctly
- [ ] Career entries show location (Berlin, Tokyo, Oxford, etc.)
- [ ] Timeline is responsive on mobile

### Publications
- [ ] Page loads at `/publications/`
- [ ] MSc thesis information displays
- [ ] MPP thesis information displays
- [ ] Research projects listed (ML-Strom, DiD Analysis, LLM Energy)
- [ ] Research interests and skills sections visible

### Blog
- [ ] Page loads at `/blog/`
- [ ] Welcome post appears in list
- [ ] Blog post metadata shows (date, author, reading time)
- [ ] Can click post to read full content
- [ ] Post layout displays correctly at `/blog/<post-title>`
- [ ] "Back to Blog" link works on individual posts

### Search
- [ ] Page loads at `/search/`
- [ ] Search input field appears
- [ ] Typing "machine" returns results
- [ ] Typing "data" returns results
- [ ] Typing "python" returns results
- [ ] Results display title and content preview
- [ ] No results message appears for gibberish search

### Contact
- [ ] Page loads at `/contact/`
- [ ] Contact form displays with Name field
- [ ] Contact form has Email field
- [ ] Contact form has Subject field
- [ ] Contact form has Message field
- [ ] Submit button visible
- [ ] **NOTE:** Form requires Formspree setup to actually send emails (see pending)

---

## Navigation & UI

### Dark Mode Toggle
- [ ] 🌙 moon button appears in top-right corner (all pages)
- [ ] Clicking button toggles to ☀️ sun icon
- [ ] Clicking sun icon toggles back to 🌙 moon
- [ ] Dark mode persists after page reload
- [ ] Dark mode works on Homepage
- [ ] Dark mode works on Experience page
- [ ] Dark mode works on Publications page
- [ ] Dark mode works on Blog listing
- [ ] Dark mode works on Blog post pages
- [ ] Dark mode works on Search page
- [ ] Dark mode works on Contact page
- [ ] Text is readable in dark mode
- [ ] Links are styled appropriately in dark mode
- [ ] Button hovers work smoothly

### Navigation Links
- [ ] Homepage shows navigation links at bottom (Explore section)
- [ ] Experience page has nav menu on left sidebar
- [ ] Publications page has nav menu on left sidebar
- [ ] Blog page has nav menu on left sidebar
- [ ] Blog post pages have full navigation menu
- [ ] Search page has navigation menu
- [ ] Contact page has navigation menu
- [ ] All nav links work correctly

### Header Links
- [ ] "Henry C G Baker" title links to homepage
- [ ] Avatar image displays and links to homepage
- [ ] Position shows "Research Engineer"
- [ ] Affiliation "Hertie School of Governance" is clickable
- [ ] Affiliation link goes to https://www.hertie-school.org/
- [ ] Email displays as contact info
- [ ] GitHub icon links to github.com/henrycgbaker
- [ ] LinkedIn icon links to correct profile
- [ ] Twitter icon links to correct profile (if configured)

---

## SEO & Metadata

### Open Graph Tags
- [ ] Share homepage on Facebook and see preview
- [ ] Share homepage on LinkedIn and see preview
- [ ] Share homepage on Twitter and see preview
- [ ] Title displays correctly in preview
- [ ] Description shows in preview
- [ ] Avatar image shows in preview
- [ ] Blog posts have working OG tags

### Structured Data
- [ ] Page passes JSON-LD validation
- [ ] Google Knowledge Graph recognizes Person schema
- [ ] Job title displays in search results

### Sitemap
- [ ] `/sitemap.xml` is accessible
- [ ] All main pages listed in sitemap
- [ ] Sitemap is valid XML

### RSS Feed
- [ ] `/feed.xml` is accessible
- [ ] Feed contains blog posts
- [ ] Feed has valid RSS structure
- [ ] Feed can be added to RSS reader

---

## Content Accuracy

### Homepage Content
- [ ] About section mentions sustainable computing
- [ ] About section mentions Hertie Data Science Lab
- [ ] Affiliations include Weizenbaum Institute link
- [ ] Affiliations include Open Data Institute link
- [ ] Technical skills list Python, R, PyTorch, TensorFlow
- [ ] Languages include English, Japanese, French

### Experience Page
- [ ] Shows Research Engineer role at Hertie
- [ ] Shows Policy Researcher role
- [ ] Shows Masters degree
- [ ] Shows Bachelor's degree from Oxford
- [ ] Locations include Berlin, Tokyo, Oxford
- [ ] Timeline has visual connecting line

### Publications Page
- [ ] MSc thesis title about LLM energy efficiency
- [ ] MPP thesis about data institutions governance
- [ ] ML-Strom project listed
- [ ] DiD Analysis project listed
- [ ] Research interests align with homepage

### Blog Post
- [ ] Welcome post title displays
- [ ] Post date shows: December 15, 2024 (or current date)
- [ ] Post content is readable
- [ ] Post mentions research interests

---

## Responsive Design

### Mobile (< 768px)
- [ ] All pages display correctly on mobile
- [ ] Navigation is accessible on mobile
- [ ] Dark mode toggle visible and clickable
- [ ] Text is readable (no overflow)
- [ ] Images scale properly
- [ ] Timeline is readable on mobile

### Tablet (768px - 1024px)
- [ ] Layout adapts to tablet size
- [ ] Navigation menu works on tablet
- [ ] Content area is appropriately sized

### Desktop (> 1024px)
- [ ] Full sidebar layout visible
- [ ] Navigation appears on left
- [ ] Content area has proper width
- [ ] Timeline displays with proper spacing

---

## Performance

### Page Load
- [ ] Homepage loads quickly
- [ ] Blog page loads quickly
- [ ] Navigation between pages is responsive
- [ ] Dark mode toggle is instant

### Images
- [ ] Avatar image loads
- [ ] Favicon loads (light and dark modes)
- [ ] No broken image links

---

## Social Icons

- [ ] GitHub icon visible and links to profile
- [ ] LinkedIn icon visible and links to profile
- [ ] Twitter icon visible and links to profile (if configured)
- [ ] CV icon visible and links to CV (if uploaded)
- [ ] All icons have proper spacing
- [ ] Icons are appropriately sized

---

## Pending Features (Needs Setup)

### Formspree Contact Form
- [ ] **STATUS:** ⏳ Awaiting Form ID
- **Steps to enable:**
  1. Go to https://formspree.io/
  2. Sign up and create new form
  3. Copy Form ID (e.g., `f1a2b3c4`)
  4. Edit `contact.md` line 11: replace `YOUR_FORM_ID`
  5. Push to deploy
  - [ ] Form ID added to contact.md
  - [ ] Contact form successfully sends test email

### Google Analytics
- [ ] **STATUS:** ⏳ Awaiting Measurement ID
- **Steps to enable:**
  1. Go to https://analytics.google.com/
  2. Create property for your site
  3. Get Measurement ID (format: `G-XXXXXXXXXX`)
  4. Edit `_config.yml` line 42: add your ID
  5. Push to deploy
  - [ ] Google Analytics ID added to _config.yml
  - [ ] Analytics tracking appears in Google Analytics dashboard
  - [ ] Page views being recorded

---

## Browser Compatibility

- [ ] Works in Chrome/Chromium
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## Issues Found During Testing

**Issue #1: [Description]**
- Status: [ ] Reported [ ] Fixed [ ] Won't Fix
- Details:

**Issue #2: [Description]**
- Status: [ ] Reported [ ] Fixed [ ] Won't Fix
- Details:

---

## Sign-Off

- [ ] All core features tested and working
- [ ] Dark mode functioning properly
- [ ] Navigation complete
- [ ] Content accurate
- [ ] SEO properly configured
- [ ] Ready for public launch

**Tester Name:** ___________________

**Date Completed:** ___________________

**Notes:**

