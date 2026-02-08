# MA Painting

Professional Painter & Decorator website for [mapainting.uk](https://mapainting.uk).

Serving West Yorkshire and surrounding areas.

## Tech Stack

- Static HTML/CSS/JS served by **Cloudflare Pages**
- **Cloudflare Pages Functions** (Workers) for the contact form API
- SVG logo
- No frameworks, no build step

## Project Structure

```
mapainting/
├── public/              # Static assets (served by Cloudflare Pages)
│   ├── index.html       # Main website
│   └── assets/
│       └── logo.svg     # Logo
├── functions/           # Cloudflare Pages Functions (Workers)
│   └── api/
│       └── contact.js   # POST /api/contact - handles form submissions
├── wrangler.toml        # Cloudflare configuration
├── package.json         # Dev/deploy scripts
└── README.md
```

## Local Development

```bash
# Run locally with Wrangler (includes Workers)
npm run dev

# Preview on a specific port
npm run preview
```

This starts a local server at `http://localhost:8788` with full Pages Functions support.

## Deploy to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages
2. Create a project > Connect to Git > Select the `mapainting` repo
3. Set build output directory to `public`
4. Deploy

Cloudflare will auto-deploy on every push to `main`.

### Option 2: Direct Deploy via CLI

```bash
# Login to Cloudflare
npx wrangler login

# Deploy
npm run deploy
```

## Custom Domain

After deploying, add `mapainting.uk` as a custom domain in the Cloudflare Pages project settings.

## Contact Form Storage (Optional)

To persist contact form submissions in Cloudflare KV:

```bash
# Create a KV namespace
npx wrangler kv:namespace create CONTACT_SUBMISSIONS

# Add the returned ID to wrangler.toml, then redeploy
```

## License

All rights reserved.
