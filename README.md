# DisasterWatch Frontend

DisasterWatch is a dual-application Vue 3 experience that lets the public monitor seismic activity and request support while giving coordinators a lightweight admin console to manage shelters, alerts, and reports. This repository ships mock data in place of a backend, and the contact workflow uses EmailJS for email delivery.

## 🧭 System Flow

### Public User App (`public user/`)
1. Visitor lands on the Home page, sees regional highlights, earthquake cards, and quick facts.
2. LiveMap and Safety Recommendations rely on the mock `client.js` data. Selecting a province/city updates the displayed shelter and earthquake cards instantly via computed filters.
3. Shelter Finder lists evacuation centers with contact info, capacity, and status icons.
4. In the Safety or Contact views the visitor fills the contact form. Submitting the form invokes EmailJS (via `@emailjs/browser` in `public user/src/components/ContactPage.vue`) so the request is delivered directly to the admin inbox without needing a backend server.

### Admin Dashboard (`admin/`)
1. Coordinators open the admin app and authenticate via the built-in Login view (local view-only state; no backend verification).
2. After logging in, the Sidebar navigation shows Dashboard, Shelters, Alerts, Reports, and Settings views powered by the mock API.
3. The Dashboard aggregates shelter counts, alerts, AI insights, and recent activities. Buttons emit navigation events via the shared `navigate` context.
4. Shelter Management lets admins search, filter by status, and edit mock shelter details.
5. Alerts and Reports show earthquake events, incident reports, and AI recommendation logs. Reports now open a lightweight modal when viewing report or AI log details, while export buttons log the current record count for tracing.
6. The Settings view currently shares form listeners that log input data; those hooks can become API calls in a full implementation.
7. Logout simply resets the local route to Login for development convenience.

## 🏗️ Project Structure

```
disasterwatch/
├── admin/                     # Coordinator dashboard with mock API data
├── public user/               # Public-facing experience with LiveMap and contact form
└── README.md                  # This overview
```

## 🚀 Getting Started

1. Install dependencies and run both apps in parallel terminals (two shells are ideal):

```bash
cd admin && npm install && npm run dev
```

```bash
cd "public user" && npm install && npm run dev
```

2. Admin interface defaults to port `5173`, the public user app to `5174` (or the next available port).

## ✉️ EmailJS Contact Flow

- The public contact form sends mail through EmailJS using the `@emailjs/browser` client (`public user/src/components/ContactPage.vue`).
- Configure `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` in the public app’s `.env` file to match your EmailJS dashboard credentials.
- Form submissions call `emailjs.send(...)`, log the payload for tracing, and show success/error UI without touching a backend.

## 🧩 Mock Data Highlights

- **Regions & Cities**: Predefined provinces with cities that feed all data cards.
- **Shelters**: Eight shelters with capacity, status, and last-updated metadata.
- **Earthquakes**: Sample events with magnitude/depth/time.
- **Teams/Partners**: Static lists used in public home and about pages.
- **Safety Resources**: Office contacts, emergency hotlines, and FAQ entries.

## 🛠️ Customization Notes

- Expand `client.js` mock data arrays to trial new scenarios.
- The shared API client exposes helpers (`getEarthquakes`, `getShelters`, etc.) that the views consume.
- Add real API hooks by replacing the mock functions and wiring them to a backend when available.

## ✅ Key Features

- Dual Vue applications (admin + public) with shared mock data
- Form input listeners across admin views for future data binding
- Responsive layouts, search/filter helpers, and navigation via `Sidebar.vue`
- Simple login/logout experience that can be wired to real auth later
- Groq AI-powered recommendation hooks plus modal detail views for reports and AI logs
- EmailJS-powered contact form implemented via `@emailjs/browser`

## 🧪 Testing & Validation

- Run `npm run dev` in both apps to ensure UI loads and navigation works.
- Use the browser console to view logged events from form listeners and button handlers.
- The contact form logs the EmailJS payload before sending to aid debugging.

## 🤖 Groq AI Recommendations

- The admin dashboard can call `admin/src/api/groqAI.js`, which posts to `https://api.groq.com/openai/v1/chat/completions` using Groq’s Llama-based models (default: `meta-llama/llama-4-scout-17b-16e-instruct`, fallback `llama-3.3-70b-versatile`).
- `generateAIRecommendations`, `generateQuickSafetyTip`, and `analyzeAreaRisk` accept mock shelter/earthquake/alert context, clean the model’s response, and expect `VITE_GROQ_API_KEY` defined in the `.env` to work. Failures log friendly fallbacks.
- The public contact form drives EmailJS via `@emailjs/browser`, so the Vue component sends mail directly to the Admin inbox without a backend layer.

## 🗂️ Deployment Notes

- Use `npm run build` inside each directory to produce production artifacts in their respective `dist/` folders.
- Serve those static outputs from any web server or integrate into a common hosting solution.

## 📄 License

Proprietary – DisasterWatch System
