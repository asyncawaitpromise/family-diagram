# Family Diagram Web App

A local-first web application for creating interactive diagrams of family dynamics with detailed notes about family members.

## Features

- **Interactive Canvas**: Canvas-based drawing interface using Konva.js for smooth interactions
- **Shape Management**: Add, select, move, and delete shapes representing family members
- **Local-First**: All data stored locally using localStorage - no server required
- **Progressive Web App**: Works offline with PWA capabilities
- **Mobile Friendly**: Touch-optimized for mobile devices
- **Data Export**: Download your family diagrams as files for backup

## Tech Stack

- **Frontend**: React with Vite
- **Canvas**: Konva.js and react-konva for interactive graphics
- **UI**: DaisyUI + Tailwind CSS for styling
- **Icons**: react-feather for consistent iconography
- **Routing**: react-router-dom
- **Storage**: localStorage for persistence

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Usage

- Use the toolbar to add shapes (circles, rectangles, stars) to represent family members
- Click/tap shapes to select them (shows dashed border)
- Drag selected shapes to move them around the canvas
- Use the red X button to delete selected shapes
- All changes are automatically saved to localStorage
