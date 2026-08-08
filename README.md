# Smart Budget Planner – Full-Stack Personal Finance Management System

**Smart Budget Planner** is a **Full-Stack Personal Finance Management System** built using the MERN Stack. It helps users manage budgets, track expenses, organize financial events, and analyze their spending through reports and dashboards.

---

## 🚀 Demo

> 🌐 Live Demo: 👉 [View Smart Budget Planner](YOUR_VERCEL_URL)
---

## 🛠️ Tools Used

| Tool | Description |
|---|---|
| **MongoDB** | NoSQL database for storing users, budgets, expenses, and events |
| **Express.js** | Backend REST API framework |
| **React** | Frontend UI library |
| **Node.js** | Server-side JavaScript runtime |
| **Vite** | Fast frontend build tool |
| **Axios** | HTTP client for API communication |
| **Chart.js** | Financial reports and data visualization |
| **React Router** | Frontend routing |
| **JWT** | Authentication and authorization |
| **bcrypt** | Password hashing |
| **CSS** | Responsive user interface styling |
| **Postman** | API testing |
| **VS Code** | Code editor |
| **Vercel** | Frontend deployment |
| **Render** | Backend deployment |
| **MongoDB Atlas** | Cloud database hosting |

---

## 🌟 Features

- 🔐 **Authentication & Security** – JWT-based Register, Login and Logout with bcrypt password hashing
- 👤 **User Profile Management** – Update profile information and account preferences
- 🏠 **Dashboard** – View an overview of your financial activity
- 💰 **Budget Planner** – Create, edit, delete and manage budgets
- 💸 **Expense Management** – Add, edit, delete and track expenses
- 🔎 **Expense Search & Filtering** – Search expenses and filter them by category
- 📅 **Event Management** – Create and manage events with individual budgets
- 📊 **Financial Reports** – Analyze spending through visual charts and summaries
- 📈 **Category Analysis** – View expenses grouped by spending category
- 📆 **Monthly Spending** – Track spending trends over time
- ⚙️ **Settings** – Manage profile, currency, password and preferences
- 🚪 **Secure Logout** – Clear authentication and protect private routes
- 📱 **Responsive UI** – Mobile and tablet-friendly interface
- ☰ **Responsive Navigation** – Hamburger menu for phones and tablets
- 🛡️ **Protected Routes** – Dashboard pages require authentication
- 🌐 **REST API** – Frontend communicates with the Express backend through REST endpoints

---

## 🖼️ Overview

### Dashboard

Add your dashboard screenshot here.

### Budget Planner

Add your budget planner screenshot here.

### Expenses

Add your expenses screenshot here.

### Events

Add your events screenshot here.

### Reports

Add your reports screenshot here.

### Settings

Add your settings screenshot here.

---

## 🚀 Getting Started

### 🔐 Environment Variables Setup

1. Create a `.env` file in the **backend** folder:
   ```env
   
   PORT=5000
   MONGO_URI=your_mongo_uri

   JWT_SECRET=your_access_token_secret
   JWT_EXPIRE=7d

   NODE_ENV=development
   REACT_APP_API_URL=your_react_app_api_url
   
3. Add .env to .gitignore to keep it private.
4. Restart your dev server after setting these variables.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14+)
- **npm**
- **MongoDB** Atlas account

### Installation

 🧬 Clone the repository:
   ```bash
   git clone https://github.com/Kundan696922/doneit.git
   cd doneit
   ```

🔧 Run the Backend
   ```bash
   cd backend
   npm install
   npm run dev
   ```

💻 Run the Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
