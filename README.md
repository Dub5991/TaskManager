# Task Management App

A next-generation productivity and journaling platform built with **React**, **TypeScript**, **Vite**, and **Bootstrap**.  
Seamlessly manage tasks, track progress, and capture thoughts—all in one place.

---

## 🚩 Key Features

- **Advanced Task Management**
  - Create, edit, delete, and complete tasks
  - Organize with categories, labels, due dates, subtasks, attachments, and comments
  - Recurring tasks and voice input

- **Productivity Insights**
  - Visual analytics and milestone tracking
  - Pomodoro timer, streaks, achievements, and points
  - Customizable dashboard widgets

- **Journaling Suite**
  - Notebook/Section/Page hierarchy (OneNote-style)
  - Rich entries: moods, images, audio, and auto-save
  - Persistent sidebar for quick navigation

- **User Profile & Authentication**
  - LinkedIn-style profile: avatar, stats, streaks, achievements
  - Secure Auth0 integration

- **Notifications & Offline Support**
  - Notification bell and offline status indicator

- **Modern, Responsive UI**
  - Built with React-Bootstrap, Mantine, and Framer Motion for a sleek, accessible experience

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installation

```sh
git clone https://github.com/Dub5991/task-management.git
cd task-management
npm install
```

### Start the App

```sh
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Project Structure

```
src/
  components/      # Reusable UI components
  context/         # React Context providers (tasks, theme, user)
  hooks/           # Custom React hooks
  pages/           # App pages (Dashboard, Profile, Notes, etc.)
  types/           # TypeScript types/interfaces
  utils/           # Utility functions
  api/             # API abstraction (local/demo)
  App.tsx          # Main app component
  main.tsx         # Entry point
```

---

## 🔐 Authentication

This app uses [Auth0](https://auth0.com/) for authentication.  
Configure your credentials in a `.env` file or as Vite environment variables:

```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

---

## 📊 Analytics & Gamification

- Visualize productivity with charts and milestones
- Earn achievements and points for completing tasks and maintaining streaks

---

## 📝 Journaling

- Organize notes in notebooks, sections, and pages
- Add moods, media, and rich text to entries
- Persistent sidebar for fast navigation

---

## 🤝 Contributing

Contributions are welcome!  
For major changes, please open an issue to discuss your ideas first.

---

## 📄 License

MIT

---

## 🙌 Credits

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Bootstrap](https://getbootstrap.com/)
- [Mantine](https://mantine.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Auth0](https://auth0.com/)

---

> Built with ❤️ for productivity enthusiasts.  
> Use, modify, and contribute!

