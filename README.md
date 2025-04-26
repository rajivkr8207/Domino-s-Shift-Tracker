# Domino's Shift Tracker 🍕⏱️

![App Screenshot](/public/screenshot.png) <!-- Add your screenshot path here -->

A simple shift management application for Domino's Pizza employees to track their work hours and shifts.

## Table of Contents
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)

## ✨ Features
- 📅 Add shifts with date and time tracking
- ⏱️ Automatic hours calculation
- 🗑️ Delete single or all shifts
- 💾 Local storage persistence
- 📱 Mobile-friendly interface
- 🔔 Toast notifications
- 🎨 Clean, intuitive UI

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Steps
1. Clone the repository:
```bash
git clone https://github.com/your-username/dominos-shift-tracker.git
```
2. Navigate to project directory:
```bash
cd dominos-shift-tracker
```
3. Install dependencies:
```bash
npm install
```

4. Start development server:
```bash
npm run dev
```

5. Open in browser:
```bash
http://localhost:3000
```
## 📋 Usage
### Adding a Shift
1. Select date from date picker

2. Enter start and end times

3. Click "Add Shift" button

4. View automatically calculated hours

### Managing Shifts
- View all shifts in chronological order

- Delete individual shifts with the trash icon

- Clear all data with "Clear All" button

### 🛠️ Technology Stack
- Frontend: React with TypeScript

- State Management: Context API

- Styling:Tailwind css

- Notifications: react-toastify

- Build Tool: Vite

## 📂 Project Structure
```bash
dominos-shift-tracker/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable components
│   ├── context/         # State management
│   ├── App.tsx          # Main component
│   └── main.tsx         # Entry point
├── .gitignore
├── package.json
├── README.md
└── vite.config.ts
```
