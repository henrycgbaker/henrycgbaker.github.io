---
layout: homepage
title: Blog & Articles
permalink: /blog/
---

# Blog & Research Articles

Thoughts on data science, sustainable computing, governance, and research methodology.

<div style="margin-top: 2rem;">

{% for post in site.posts %}

  <div style="margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee;">
    <h3 style="margin: 0 0 0.5rem 0;">
      <a href="{{ post.url }}" style="text-decoration: none; color: inherit;">{{ post.title }}</a>
    </h3>
    <p style="margin: 0.5rem 0; color: #666; font-size: 0.9rem;">
      <strong>{{ post.date | date: "%B %d, %Y" }}</strong>
      {% if post.author %} • By {{ post.author }}{% endif %}
      {% if post.reading_time %} • {{ post.reading_time }} min read{% endif %}
    </p>
    <p style="margin: 0.5rem 0; color: #555;">{{ post.excerpt }}</p>
    <a href="{{ post.url }}" style="color: #333; font-weight: 500; text-decoration: none;">Read more →</a>
  </div>
{% endfor %}

</div>

{% if site.posts.size == 0 %}

<p style="color: #999; margin-top: 2rem;">No articles yet. Check back soon!</p>
{% endif %}

---

## Topics I Write About

- **Green AI & Sustainable Computing** — Making AI more environmentally responsible
- **Data Governance** — How institutions should manage collective data
- **Research Methodology** — Machine learning, causal inference, statistics
- **Policy & Technology** — Intersection of governance and AI/tech
- **Lessons from East Asia** — Observations from 5 years working in Japan and Asia

---

## Subscribe

**Coming soon:** Subscribe to articles via email or RSS feed.

[RSS Feed](/feed.xml) (once available)
