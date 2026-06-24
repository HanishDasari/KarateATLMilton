# Karate Atlanta Milton — Website

A fast, modern, mobile-first website for **Karate Atlanta Milton** that puts
everything families and instructors need in **one place**: programs, schedule,
pricing, online tuition payment, reviews, FAQ, and contact — with conversion
features designed to bring in more students.

Built with plain HTML, CSS, and JavaScript — **no build step, no dependencies.**
It runs anywhere and is trivial to host for free.

---

## ✨ What's included

| Feature | Why it matters |
| --- | --- |
| **Free-trial lead capture form** (hero) | Turns visitors into booked trial classes — the #1 driver of new students |
| **Floating "Free Trial" button** | Always-visible call to action as people scroll |
| **All programs in one view** (Tiny Tigers, Juniors, Teens, Adults) | Parents instantly find the right class |
| **Filterable weekly schedule** | One schedule instead of multiple portals/emails |
| **Online tuition payment** | Direct, secure link to your existing MyStudio portal |
| **Pricing plans** (Free Trial / Unlimited / Family) | Clear, honest pricing reduces friction |
| **Auto-rotating reviews** | Social proof builds trust |
| **Photo gallery** | Show off the dojang (swap in real photos) |
| **FAQ accordion** | Answers objections before they call |
| **Google Map + click-to-call + directions** | Removes every barrier to visiting |
| **Birthday-party promo** | An extra revenue stream |
| **SEO built in** | Meta tags, Open Graph, sitemap, and Google "LocalBusiness" structured data to rank in local search |
| **Fully responsive + accessible** | Looks great on phones; keyboard- and screen-reader-friendly |

---

## 🚀 View it locally

No tools required — just open `index.html` in a browser. For the schedule
filter, form, and map to behave exactly like production, serve it over a
tiny local web server:

```bash
# Python 3 (already on most machines)
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 🌐 Deploy it (free options)

All of these host static sites for free and connect to
`karateatlantamilton.com`:

- **Netlify** — drag the project folder onto <https://app.netlify.com/drop>, done.
- **Vercel** — `vercel` in this folder, or import the GitHub repo.
- **GitHub Pages** — push to GitHub, then Settings → Pages → deploy from branch.
- **Cloudflare Pages** — connect the repo; build command: *(none)*, output dir: `/`.

After deploying, point the domain's DNS to your host and you're live.

---

## ✏️ How to edit the content (no coding needed)

Everything is plain text inside the HTML files. Common edits:

| To change... | Edit this |
| --- | --- |
| Phone number | Search for `678` and `6786240506` in `index.html` |
| Address | Search for `13083 Hwy 9` |
| Hours | The `Class Hours` list and the schedule table in `index.html` |
| Class times | The table inside the `<!-- SCHEDULE -->` section of `index.html` |
| Prices | The `<!-- PRICING -->` section of `index.html` |
| Reviews | The `<!-- TESTIMONIALS -->` section of `index.html` |
| Payment link | Search for `cp.mystudio.io` (used in a few spots) |
| Social links | The `socials` block in the footer of `index.html` |

### Adding real photos
The gallery and program tiles currently use colorful placeholders. To use real
photos, drop images into an `assets/` folder and replace a tile's background.
For example, in `css/styles.css` change:

```css
.g1 { background: linear-gradient(150deg, #e11d2a, #7a0c12); }
```
to:
```css
.g1 { background: url('../assets/forms.jpg') center/cover; }
```

---

## 🔌 Connecting the free-trial form to real leads

Right now the form shows a success message and saves submissions to the
browser's local storage (great for a demo). To receive real leads, point it at
any of these — each is a one-line change in `index.html` (the `<form>` tag) or
a small tweak in `js/main.js`:

- **Formspree** / **Netlify Forms** — add an `action` URL; no backend needed.
- **MyStudio lead capture** — link the button to your studio's intake form.
- **Email** — set the form `action` to a service that emails you each lead.

Look for the comment `// NOTE: Wire this to your CRM` in `js/main.js`.

---

## 📁 Project structure

```
.
├── index.html        # Home — all sections in one page
├── programs.html     # Detailed program pages
├── 404.html          # Friendly not-found page
├── robots.txt        # SEO
├── sitemap.xml       # SEO
├── css/styles.css    # Design system + all styles
└── js/main.js        # Interactivity (forms, slider, schedule filter, etc.)
```

---

## 📞 Business details encoded in the site

- **Karate Atlanta Milton** — ATA Taekwondo
- 13083 Hwy 9, Ste 720, Milton, GA 30004
- (678) 624-0506
- Serving Milton, Crabapple, Roswell, Alpharetta & Dunwoody
- Online payments via MyStudio

> Pricing figures are sensible placeholders — confirm and update them with the
> school's real rates before going live.
