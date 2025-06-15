---
layout: default
title: "Tag: windows"
tag: windows
permalink: /tag/windows/
---

<section class="post-section">
  <h1 class="post-title" data-aos="zoom-in">Machine Windows</h1>

  <ul class="post-list" data-aos="fade-up">
    {% for post in site.posts %}
      {% if post.tags contains page.tag %}
      <li class="post-card">
        {% if post.image %}
          <img src="{{ post.image | relative_url }}" alt="{{ post.title }}" class="post-thumb">
        {% endif %}
        <div class="post-content-wrapper">
          <a href="{{ post.url | relative_url }}" class="post-title-link">{{ post.title }}</a>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <small>{{ post.date | date: "%d %B %Y" }}</small>
          <div class="post-tags">
            {% for tag in post.tags %}
              <a href="/tag/{{ tag | slugify }}/" class="tag-badge">#{{ tag }}</a>
            {% endfor %}
          </div>
        </div>
      </li>
      {% endif %}
    {% endfor %}
  </ul>
  <a href="/blog/" class="btn" style="display:inline-block;margin-top:2rem;" data-aos="fade-right">← Kembali</a>
</section>
