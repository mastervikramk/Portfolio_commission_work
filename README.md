# Arthur Visions (आर्थर विज़न्स)

**Award-Winning Fine Art & Custom Portrait Studio by Vinita**  
*Based in Muzaffarpur, Bihar — Handcrafted Portraits & Heritage Vajjika Art Delivered Across India.*

---

## 🎨 Architecture & ₹0/month Tech Stack

* **Frontend:** React 19 (Vite) + Tailwind CSS + Lucide Icons + Cormorant Garamond & Inter Typography
* **Edge Backend:** **Cloudflare Worker** (`worker.js`) running natively on Cloudflare Edge with Static Assets
* **Email & Notifications:** **Cloudflare Email Routing** (`send_email` binding) for instant commission alerts & Passwordless OTP
* **Hosting:** Cloudflare Workers with Static Assets (unlimited bandwidth & fast edge caching across India)
* **Total Running Cost:** **₹0/month** (Only ~₹500–₹600/year for `arthurvisions.in` domain)

---

## 📁 Directory Structure

```
Portfolio_commission_work/
├── frontend/                     # React + Tailwind CSS client
│   ├── public/                   # Favicon, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/           # Navbar, Footer, WhatsAppButton, LightboxModal, Estimator
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero carousel, trust marquee, featured works, video
│   │   │   ├── Gallery.jsx       # Category tabs, filter, search, lightbox zoom
│   │   │   ├── Order.jsx         # 4-step commission form, pricing matrix, packaging FAQ
│   │   │   ├── Recognition.jsx   # Padma Shri Dulari Devi, NIFT, dignitaries, certificates
│   │   │   ├── About.jsx         # Artist story, NIFT mentorship, Vajjika art revival
│   │   │   ├── Contact.jsx       # Studio info, WhatsApp, direct inquiry selector
│   │   │   └── Admin.jsx         # Studio Artist Portal (Passwordless Email OTP & Full Edit)
│   │   ├── data/                 # artworks.js, awards.js, faqs.js
│   │   ├── App.jsx
│   │   └── index.css             # Tailwind v4 theme palette tokens
│   ├── package.json
│   └── vite.config.js
│
├── worker.js                     # Unified Cloudflare Worker (APIs, Email dispatch, Asset serving)
└── wrangler.jsonc                # Cloudflare Worker configuration & bindings
```

---

## 🚀 Running Locally

### 1. Run the Frontend (React):
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Test Production Build:
```bash
cd frontend
npm run build
```
The compiled, production-ready static assets are in `frontend/dist/`.

---

## 📱 Artist Admin Portal

* Go to **`http://localhost:5173/#admin`** (or click **"Artist Portal"** in the footer).
* **Default PIN:** `2025` (or `1234`).
* **Features:**
  1. **Upload New Artwork:** Take a photo from mobile, add title, medium, dimensions, price, and publish directly to the live gallery.
  2. **Manage Catalog:** One-click toggle between `Available` and `Commissioned/Sold`.
  3. **Orders Inbox:** View customer inquiries, requested sizes, notes, and 1-click **Reply on WhatsApp** to the customer.

---

## ☁️ Deploying to Cloudflare (Step-by-Step)

### 1. Deploy Frontend to Cloudflare Pages (Free)
1. Push this repository to GitHub.
2. In your Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository:
   * **Framework preset:** `Vite`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
   * **Root directory:** `frontend`
4. Click **Save and Deploy**. Your site will be live on `*.pages.dev` with free SSL and global CDN.
5. In **Custom Domains**, connect `arthurvisions.in`.

### 2. Deploy Python Worker Backend (Free)
```bash
cd backend

# Create Cloudflare D1 database:
npx wrangler d1 create arthurvisions-db
# Copy the database_id into wrangler.toml

# Apply database tables:
npx wrangler d1 execute arthurvisions-db --file=schema.sql

# Create R2 storage bucket:
npx wrangler r2 bucket create arthurvisions-storage

# Deploy Worker:
npx wrangler deploy
```

---

## 🎨 Brand Color Palette Reference
* `paper`: `#FAF7F2` (Artisanal cotton paper background)
* `parchment`: `#F0E9DC` (Warm card containers & footer)
* `charcoal`: `#1F1D1B` (Deep organic black text & pencil sketch shade)
* `graphite`: `#5A554F` (Secondary text & dimensions)
* `terracotta`: `#B5502F` (Primary action button & passionate earthen red)
* `ochre`: `#C99A2E` (National awards & honors ribbon)
* `indigoink`: `#2F3E5C` (Pen portraits & historic Champaran indigo)
* `sage`: `#6B7F5E` (Available for purchase badge)
* `line` / `sand`: `#DDD3C3` (Frame borders & dividers, avoiding collision with Tailwind's default stone)

