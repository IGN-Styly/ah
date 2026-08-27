# Auction House

Auction House is real-time web application for buying and selling Minecraft NBT items in an open market for coins.
---

## Features

- **Real-time Auctions:** List, bid, and buy items with instant updates using Convex as the backend.
- **Authentication:** Secure sign-in and user management powered by BetterAuth.
- **Modern UI:** Built with Radix UI components and styled using Tailwind CSS for a clean, accessible interface.
- **Environment Management:** Uses T3 Env for easy environment variable handling.

---

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org) (App Router, Server/Client Components)
- **UI:** [React 19](https://react.dev), [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Convex](https://convex.dev) (real-time database and API)
- **Authentication:** [BetterAuth](https://github.com/convex-dev/better-auth)
- **Other:** TypeScript, Zod, T3 Env, and more

---

## Directory Structure

```
src/
  app/           # Next.js app directory (routing, layouts, pages)
    (authed)/    # Authenticated user routes (dashboard, inventory)
    (unauthed)/  # Public routes (about, pricing, privacy, signin)
    api/         # API routes (auth)
  components/    # Reusable UI and utility components
  hooks/         # Custom React hooks
  lib/           # Utility libraries (auth, config, price, utils)
  types/         # TypeScript types (e.g., auction types)
public/          # Static assets
convex/          # Convex backend functions and schema
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Run the development server:**
   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---


*This project is an experiment in rapid MVP development using the BENTO stack. For more details, see the source code.*
