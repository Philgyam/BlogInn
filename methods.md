# Prompt: Build a Visually Stunning Blogging Website

Copy everything below into your AI coding agent.

---

Build a complete, production-ready blogging website. Design quality is the top priority — this should look like it was designed by a top-tier design studio, not a generic template. Do not stop until it's fully functional and polished.

## Design Direction (non-negotiable): Apple "Liquid Glass" style

Build the entire UI around Apple's frosted-glass / "Liquid Glass" aesthetic (the look used across recent iOS/macOS/visionOS surfaces). Specifics:

- **Glass surfaces everywhere it makes sense**: nav bar, cards, modals, the mobile menu, buttons, search bar, tags/pills. Each uses `backdrop-filter: blur(20-40px) saturate(150-180%)` over a semi-transparent background (`rgba(255,255,255,0.55-0.7)` on light, `rgba(20,20,25,0.5-0.65)` on dark), a hairline 1px border in `rgba(255,255,255,0.3-0.4)`, and soft multi-layer shadows for depth (a tight dark shadow + a subtle inner highlight along the top edge to fake specular light).
- **Sits on top of visual richness, not plain white** — glass only reads as glass when there's something to see through it. Use a soft animated or static gradient mesh / blurred color blobs behind content (muted, editorial tones — not neon), or large blurred cover images behind post headers, so the frosted panels have depth to refract.
- **Rounded, continuous corners** — generous radii (16–28px) on cards and buttons, matching Apple's "squircle" continuous-curvature feel as closely as CSS allows (`border-radius` with a slightly larger value than feels natural, plus `overflow: hidden`).
- **Layering and depth hierarchy**: distinct elevation levels (background → content layer → floating glass nav/cards → modals), each slightly more blurred/opaque than the one below, so scrolling content visibly moves *under* glass panels (e.g., a sticky glass nav bar with content visibly blurring as it passes beneath it).
- **Typography**: SF Pro–like system font stack (`-apple-system, "SF Pro Display", "SF Pro Text", Inter, sans-serif`) with Apple's confident weight contrast — bold, tight-tracking headlines, regular-weight body at 1.5–1.6 line-height.
- **Color**: light, airy base (soft off-white / very light gray) with one or two saturated accent colors (Apple-style blue, or a custom accent) used only for primary actions and links. Full dark mode with the same glass logic on dark, moodier gradients.
- **Micro-interactions in the Apple spirit**: buttons subtly scale/brighten on press (`active:scale-95`), glass panels get a touch more opaque/blurred on hover, smooth spring-like transitions (`cubic-bezier(0.32, 0.72, 0, 1)` or similar, 250–400ms), tab bars with a sliding glass "pill" indicator, pull-to-refresh-style feel on scroll where appropriate.
- **Every state matters**: empty states, skeleton loading screens (shimmering glass placeholders, not spinners), 404, and error states all keep the same glass language — never fall back to plain default styling.
- **Images**: tasteful cover photos or soft gradient placeholders that work well *underneath* glass — avoid busy images that clash with blur.

## Core Pages & Features

1. **Home/Feed** — featured post hero, then a well-composed grid or list of posts with cover images, category tags, reading time, and publish date.
2. **Post detail page** — beautiful reading experience: proper typography, a progress bar or reading indicator, pull quotes styled distinctly, code block styling (if technical blog), share buttons, related posts at the end.
3. **Category/tag pages** — filtered views with the same visual polish as home.
4. **Author/about page**.
5. **Search** — with a clean, fast-feeling UI (even if search logic is simple).
6. **Navigation** — sticky/smart header, mobile menu that's actually well-designed (not just a hamburger dumping a plain list).
7. **Newsletter signup** — designed as a real component, not an afterthought form.
8. **Responsive design** — flawless on mobile, tablet, and desktop. Mobile is not an afterthought.

## Technical Expectations

- Use a modern stack (React/Next.js + Tailwind is a good default unless I specify otherwise).
- Component-based architecture, clean and reusable.
- Semantic HTML and accessible markup (proper heading hierarchy, alt text, focus states, sufficient color contrast).
- Fast: optimize images, avoid layout shift, lazy-load below the fold.
- Include realistic sample content (5–8 varied blog posts with real-feeling titles/excerpts, not "Lorem ipsum" everywhere) so the design can actually be judged.

## Process

1. First, confirm how you'll implement the glass effect (blur values, background treatment, browser fallback for `backdrop-filter`) and the palette/gradient concept in a couple of sentences before building.
2. Build it fully — don't leave placeholder TODOs or half-finished pages.
3. After building, do a self-review pass specifically for visual polish: spacing consistency, alignment, color contrast, and interaction feedback — fix anything that looks templated or unfinished.
4. Give me a short summary of the design decisions you made and why.

Now generate more ideas for what would make this blog feel exceptional (unique layout ideas, signature interactions, a memorable detail) before you start building, then proceed.