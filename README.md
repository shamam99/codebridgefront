
# Code Bridge — Frontend

> Empowering developers and learners through multilingual code translation, real-time execution, and a collaborative learning community.

## 📌 Overview

**Code Bridge** is a full-stack educational platform that helps users translate, debug, and run code between programming languages like Python and JavaScript in real time. The frontend is built with **React.js**, following best practices in component structure, state management, and service abstraction.

This repository contains the **frontend source code** for Code Bridge. It includes:
- Multi-tab code editor
- Live translation and execution interface
- User authentication and profiles
- Social community features (posts, comments, followers)
- Admin dashboard tools

## 🔧 Tech Stack

- ⚛️ **React.js** — Frontend Framework
- 📦 **Axios** — For API integration
- 💾 **JWT** — Token-based session handling
- 🧭 **React Router DOM** — Page navigation
- 🎨 **Custom CSS** — Fully responsive UI/UX

## 🗂️ Folder Structure

```
codebridgefront/
├── public/
├── src/
│   ├── components/        # Reusable UI components (Navbar, Editor)
│   ├── pages/             # Route views (Home, Profile, Coding, Admin)
│   ├── services/          # API abstraction (auth, admin, code, translate)
│   ├── styles/            # Component-level CSS files
│   └── App.js             # Route configuration
│   └── index.js           # React root
├── .env                   # Environment config
├── package.json
```

## 🚀 Features

### 👩‍💻 User-Facing
- **📝 Code Translation** — Real-time translation between JS and Python
- **🧪 Run & Debug** — Simulated output & error reporting
- **👤 Profile Page** — Edit bio, avatar, and personal info
- **📁 Project Upload** — Upload zipped code projects (public/private)
- **🗨️ Community** — Post questions, like, and comment
- **🔗 Follow System** — Follow users and view their posts

### 🛠️ Admin Dashboard
- **🧑‍💼 Manage Users** — View, block, or delete users
- **📰 Publish News** — Add language or platform-related updates
- **🧹 Moderate Posts** — Remove inappropriate content

## 🔑 Authentication

- **JWT-based Auth** — Stored in `localStorage`
- **Role Handling** — Users vs. Admins
- **Protected Routes** — Community, Coding, and Profile pages require login
- **Auto Redirect** — Logout redirects to Home

## ⚙️ Environment Setup

### Prerequisites
- Node.js v18+
- Git
- React Dev Tools (recommended)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/codebridgefront.git
   cd codebridgefront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:5173`

## 🧪 Testing Features

- Manually test login, registration, and profile editing
- Run multiple translation tabs simultaneously
- Try uploading and downloading a `.zip` project
- Test post/comment creation & deletion
- Use admin credentials to access `/admin/dashboard`

## 📸 Screenshots

| Feature       | Screenshot |
|---------------|------------|
| Code Editor   | ✅ Included |
| Profile Page  | ✅ Included |
| Community     | ✅ Included |
| Admin Panel   | ✅ Included |

> For full screenshots, refer to the `/docs/screenshots/` directory.

## 🤝 Contributing

We welcome contributions! To propose a fix or improvement:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'feat: ...'`)
4. Push to your fork and create a PR

## 📌 Related Repositories

- [Code Bridge Backend](https://github.com/yourusername/codebridge)

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute with credit.

---

> Madeby Shamam 

