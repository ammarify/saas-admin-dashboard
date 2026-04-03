# ShopSync Admin Dashboard

Modern eCommerce admin dashboard built with React + Vite + Tailwind CSS.

This project includes a complete multi-screen admin interface with:
- Responsive layout and toggleable sidebar
- Light/Dark theme support
- Bilingual UI (English / Arabic with RTL support)
- Dashboard analytics widgets and charts
- Orders, Products, Customers, Reviews, Analytics, Payments, Accounts, and Support screens
- Reusable pagination and modal components
- Notification popup panel in navbar

## Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- Tailwind CSS 4 (`@tailwindcss/vite`)
- ESLint 9

## Features

### Core UX

- Professional admin layout with:
  - Sidebar navigation
  - Top navbar (search, language switch, theme switch, notifications)
  - Responsive behavior for desktop/tablet/mobile
- Sidebar behavior:
  - Desktop: fully show/hide
  - Mobile: slide drawer with backdrop close

### Themes

- Dark mode toggle in navbar
- Theme persists in `localStorage`
- Consistent light/dark styling across all major modules

### Bilingual (English / Arabic)

- Language switcher in navbar (`EN` / `AR`)
- UI translation dictionary-based system
- Language persists in `localStorage`
- Automatic document direction:
  - `ltr` for English
  - `rtl` for Arabic

### Data Screens

- Orders:
  - Mock data table
  - Status badges
  - Add/Update actions (modal)
  - Elegant pagination
- Products:
  - KPI cards + product table
  - Add/Update actions (modal)
  - Pagination
- Customers:
  - KPI cards + customer table
  - Add/Update actions (modal)
  - Pagination
- Reviews:
  - KPI cards + review cards
  - Star rating icons
  - Update modal
  - Pagination
- Payments:
  - Transaction table
  - Add/Update actions (modal)
  - Pagination
- Accounts:
  - Team accounts table
  - Add/Update actions (modal)
  - Pagination
- Support:
  - Ticket list + knowledge base
  - Add/Update actions (modal)
  - Pagination
- Dashboard:
  - Sales summary, order-time donut chart, channel cards, top products, trend graph

### Reusable Components

- `Pagination` component with:
  - Number buttons
  - Ellipsis for large pages
  - Prev/Next controls
  - Light/dark styles
- `Modal` component with:
  - Overlay backdrop
  - Escape key close
  - Outside click close
  - Scroll lock

## Project Structure

```text
src/
  app/
  constants/
  features/
    dashboard/
    orders/
    menu/         # products
    customers/
    reviews/
    settings/     # analytics
    payments/
    accounts/
    help/         # support
  hooks/
  layouts/
    dashboard/
  routes/
  services/
  shared/
    components/
      common/
      ui/
    config/
    i18n/
  store/
  styles/
  utils/
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

App will start at the URL shown by Vite (usually `http://localhost:5173`).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Build Status

Production build is verified and compiles successfully with:

```bash
npm run build
```

## Notes

- Current data is mock/static for frontend prototyping.
- Add/Update modals are UI-ready and can be connected to real API/state mutations.
- Translation keys can be extended in:
  - `src/shared/i18n/translations.js`

## License

Private project.
