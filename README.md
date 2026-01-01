# Gradly

Academic score conversion and guidance platform for students worldwide.

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Design System

### Colors
- Primary: #1E3A8A (Academic Blue)
- Success: #10B981 (Emerald)
- Warning: #F59E0B (Amber)
- Background: #FFFFFF / #F9FAFB
- Border: #E5E7EB
- Text Primary: #111827
- Text Secondary: #6B7280

### Typography
- Font: Inter
- Page Title: 32-36px, semibold
- Section Title: 22-24px
- Body: 14-16px

## Project Structure

```
gradly/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── SupportedCountries.tsx
│   ├── PricingComparison.tsx
│   └── Footer.tsx
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Current Status

Landing Page - Complete
- Navigation with logo and links
- Hero section with primary CTA
- How It Works (3 steps)
- Supported Countries grid
- Free vs Pro pricing comparison
- Footer with links

## Next Steps

Following the build order:
1. ✅ Landing Page
2. Convert Page
3. Results Page
4. Recommendations Page
5. Dashboard
6. Transcript Upload
