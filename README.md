# Namibia Marine Products static site

This folder is the upload-ready version of the Namibia Marine Products website.
It uses plain HTML, CSS, JavaScript, and the provided image assets only. There is
no build step. The desktop page background uses `images/WebBackgroundNMP.svg`,
mobile uses `images/MobileBackground.svg`, and the visible fish logo uses the
original `images/NMP-fish.png` asset.

## Upload

Upload the contents of this folder as the public web root:

- `index.html`
- `contact.html`
- `privacy-policy.html`
- `404.html`
- `styles.css`
- `script.js`
- `robots.txt`
- `sitemap.xml`
- `google60a36f6a1f030681.html`
- `images/`

`_headers` is included for hosts such as Cloudflare Pages or Netlify. `.htaccess`
is included for Apache-style hosting. Hosts that do not use those files usually
ignore them.

## Formspree

The contact form posts to the existing Formspree endpoint:

`https://formspree.io/f/mpqblbje`

The JavaScript submits the form with `fetch`, shows a success notification modal,
and leaves the form `action`/`method` in place as a fallback.
