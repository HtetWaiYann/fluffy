# Fluffy Peeps: Animated Landing Page

Part 1 of the Rezerv Frontend Engineering assessment (UI Animation Challenge).

**Live URL:** https://fluffy.htetwaiyan.com/

## Setup

You'll need Node 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
npm run lint
```

## Sections

The original reference ([nft.fluffyhugs.io](https://nft.fluffyhugs.io/)) doesn't load, so I
followed the working sample ([fluffy-animation.vercel.app](https://fluffy-animation.vercel.app/))
instead. It has exactly three screens, so I built those three:

1. **Loader**
2. **Scene 1:** a crowd of hopping items with a unique one standing in the middle.
3. **Scene 2:** lying with blobs flowing up in background

The social icons and the "View collection" button stay on screen in both scenes. As the
instructions say, they react to hover but don't go anywhere.

## Libraries

- **Next.js + TypeScript:** I chose Next.js so the HTML is rendered on the server, and
  `next/font` / `next/image` handle fonts and image sizing.
- **SCSS modules:** one style file per component, so styles can't leak between them.
- **GSAP (+ ScrollTrigger):** I picked it for timelines, so I can play the whole scene change
  forwards or backwards as one unit.
- **Lenis:** smooth scrolling. I run it on GSAP's clock (as Lenis's docs recommend), so scroll
  and animations update in the same frame.

## Animation, scroll and responsiveness

- **On load:** the crowd rises in, the nurse pops up, then the title and buttons. I start this
  under the fading loader, so the finished page never flashes first.
- **On scroll:** the hero sticks with CSS `position: sticky`. I first used GSAP's `pin`, but it
  left white gaps while resizing. The scene plays by time, not by scrollbar, so it never stops
  halfway.
- **On hover:** CSS transitions, only on devices with a mouse, so touch screens don't get stuck
  in a hover state.
- **On resize:** most sizes come from one value (`--cell`), so everything scales together. On
  portrait screens I size the peeps from the width, because they were far too big.
- **Hop delays:** each peep gets its own delay from a seeded random generator
  ([mulberry32](https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32)). I used a
  seed instead of `Math.random()` so the server and browser render the same HTML.

## Performance

Measured on a production build in headless Chrome, CPU slowed down 4x:

- 60fps while idle and during the scene change, on desktop and phone sizes. No long tasks.
- I only animate `transform` and `opacity`, because they don't trigger layout. Hidden parts
  pause their CSS animations.
- 311KB first load. All 160 crowd peeps share one 15KB SVG, and I only load the two font weights
  on screen.
- On a slow network, the counter counts in CSS until the JS arrives, so it never sits at 0%.

## Accessibility and reduced motion

- With reduced motion turned on, I switch off smooth scrolling, the hops, the blob flow and
  the entrance. I didn't want to just remove the scene change, though, because then scene 2
  would be unreachable, so it becomes a short fade where nothing moves across the screen.
- Decorative images use `alt=""` or `aria-hidden`, icon buttons have labels, and every button
  shows a focus outline for keyboard users.
- If JavaScript is off, I hide the loader so the page is still visible.

## Assumptions

- Since the original reference is unreachable, I assumed
  [fluffy-animation.vercel.app](https://fluffy-animation.vercel.app/) shows the intended design
  and motion, and used it as my reference.
- The instructions allow my own assets, so I used [Open Peeps](https://www.openpeeps.com)
  characters instead of the reference's artwork.
- I took the "View collection" blob outline from the reference. I tried a few shapes of my own,
  but none of them read as well; everything else about the button is my own.
- I assumed a reload should always start at scene 1, because the page tells a short story from
  the loader to scene 2.

## With more time

- I'd make a WebP version of the crowd peep, since redrawing 160 SVGs is the most expensive
  thing when you zoom the browser.
- I'd add Playwright tests for the scroll scene, especially resize and reload.
