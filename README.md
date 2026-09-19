# alvandcode.github.io — Personal Portfolio

[![Pages](https://img.shields.io/badge/GitHub_Pages-live-green)](https://alvandcode.github.io) [![License](https://img.shields.io/github/license/Alvandcode/alvandcode.github.io)](./LICENSE)

> My personal portfolio and projects showcase — Alvandcode. Static site, no build step.

<div dir="rtl">

## پورتفولیوی الوند

وب‌سایت شخصی و ویترین پروژه‌ها. سایت استاتیک است و نیاز به بیلد ندارد؛ کافی است `index.html` را باز کنید یا روی GitHub Pages ببینید: https://alvandcode.github.io

</div>

---

## View locally (no build needed)

```bash
git clone https://github.com/Alvandcode/alvandcode.github.io.git
cd alvandcode.github.io
# just open index.html in a browser, or:
npx serve . -p 8080
```

Live: https://alvandcode.github.io

## Structure

```
index.html      landing + projects grid
assets/         css / js / images
gamenet/        gamenet demo page
projects/       per-project pages (dns-benchmark-pro, ocr-stt-tool, ...)
404.html        custom not-found
sitemap.xml + robots.txt   SEO
sw.js + manifest  PWA (offline cache)
```

## Add a new project page

1. Copy an existing folder under `projects/` as template.
2. Add a card in `index.html` linking to it.
3. Update `sitemap.xml`.
4. Push to `main` — GitHub Pages redeploys automatically (Settings → Pages → Deploy from branch `main` / root).

## Prerequisites

None — static HTML/CSS/JS. Optional: any static server (`npx serve`, `python -m http.server`) for PWA/service-worker testing.

## License

MIT — see [LICENSE](./LICENSE).
