# Danish Syazwan — Full-Stack Developer Portfolio

A modern, high-performance personal developer portfolio engineered with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. Features fluid interaction design with **Framer Motion**, momentum inertia scrolling with **Lenis**, and native SEO optimization with dynamic sitemaps and Schema.org structured data.

🔗 **Live Deployment:** [https://danishsyazwan.vercel.app](https://danishsyazwan.vercel.app)

---

## ✦ Key Features

- **Fluid Silk Hero & Kinetic Canvas**: Custom canvas particle and fluid gradient physics synchronized with scroll progress.
- **Interactive Card Dealing & Motion Physics**: 3-card dealing animations and responsive layout transitions powered by Framer Motion.
- **Lenis Inertia Scrolling**: Buttery-smooth, momentum-based scrolling decoupled from browser jank.
- **Enterprise Contact Pipeline**: Serverless Next.js API route integrating Nodemailer with SMTP authentication and validation.
- **Comprehensive Next.js 15 SEO**:
  - Dynamic `sitemap.xml` and `robots.txt` generation (`MetadataRoute`).
  - OpenGraph & Twitter Cards with rich social preview resolution.
  - Schema.org JSON-LD (`ProfilePage` and `Person`) verified for Google Rich Results.
  - Semantic HTML architecture with accessible screen-reader keyword labeling.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **UI & Core** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/), [PostCSS](https://postcss.org/) |
| **Motion & Physics** | [Framer Motion 12](https://www.framer.com/motion/), [Lenis Scroll](https://lenis.darkroom.engineering/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) via Next.js Route Handlers |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📂 Project Architecture

```text
├── public/                  # Static assets (images, previews, videos, verification tokens)
├── src/
│   ├── app/
│   │   ├── api/contact/     # Serverless Nodemailer dispatch handler
│   │   ├── contact/         # Interactive contact page & dedicated metadata layout
│   │   ├── layout.tsx       # Root layout with JSON-LD schema & Lenis provider
│   │   ├── page.tsx         # Portfolio homepage assembling sectional stages
│   │   ├── robots.ts        # Dynamic robots.txt route
│   │   └── sitemap.ts       # Dynamic sitemap.xml generator
│   └── components/          # Modular UI components
│       ├── SilkHero.tsx     # Hero section with interactive canvas simulation
│       ├── WorkSection.tsx  # Horizontal portfolio showcase with dual theme support
│       ├── ServicesSection.tsx # Responsive 3-card deck & engineering capabilities
│       ├── ToolsMarquee.tsx # Technical arsenal grid
│       ├── Topbar.tsx       # Floating glass navigation bar
│       └── Footer.tsx       # Kinetic typography & footer navigation
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dnishsyzwn/Portfolio.git
cd Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your SMTP credentials (e.g. Gmail App Password) for contact form processing:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
CONTACT_RECEIVER_EMAIL=your-destination-email@gmail.com
NEXT_PUBLIC_SITE_URL=https://danishsyazwan.vercel.app
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Scripts

- `npm run dev` — Start the local development server with Turbopack / Fast Refresh.
- `npm run build` — Create an optimized static production build.
- `npm run start` — Run the production server.
- `npm run lint` — Run ESLint checks across the codebase.

---

## 📄 License & Attribution

Designed and engineered by **Danish Syazwan**. All rights reserved.  
Open-sourced for personal showcasing and architectural reference.
