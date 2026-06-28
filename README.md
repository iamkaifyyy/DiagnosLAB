# diagnosLAB 
> **Smart Diagnostic Decision Platform** — Helping patients find the RIGHT laboratory with clinical precision and objective trust metrics.

---

## 🌟 Overview
**diagnosLAB** is an intelligence-driven diagnostics platform. Rather than letting patients search blindly through hundreds of diagnostic centers, **diagnosLAB** leverages an algorithmic **Trust Score Engine** to evaluate accuracy, turnaround consistency, user reviews, and equipment modernity.

The application is built using a modern **MERN (MongoDB, Express, React, Node)** stack with a high-fidelity, dark-mode design system utilizing glassmorphism and emerald-cyan accents.

---

## 🚀 Key Features

*   **Smart Search & Comparison**: Search for diagnostic tests (e.g., CBC, Lipid Profile, Thyroid, MRI) and compare cost, turnaround times, and trust scores side-by-side.
*   **Trust Score Engine (v2.0)**: A proprietary grading system analyzing over 50 real-time parameters:
    *   *Lab Accuracy & Precision (95% weight)*
    *   *User Reviews & Feedback (90% weight)*
    *   *Turnaround Consistency (92% weight)*
    *   *Equipment Modernity (85% weight)*
*   **Home Collection Booking**: Book tests with NABL & CAP accredited labs and request home sample collection.
*   **Real-time Report Tracking**: Monitor the status of your samples and download reports securely once ready.
*   **Dedicated Portals**: Custom dashboards for Patients, Doctors, Labs, and Hospital partners.

---

## 🛠️ Technology Stack

### **Frontend (Client)**
*   **Framework**: React 19 + Vite
*   **Styling**: Tailwind CSS + Custom Glassmorphism Filters
*   **Icons**: React Icons (Hi/Fa)
*   **Routing**: React Router DOM (v7)
*   **HTTP Client**: Axios

### **Backend (Server)**
*   **Runtime**: Node.js + Express
*   **Database**: MongoDB (configured via Mongoose)
*   **Authentication**: JSON Web Tokens (JWT) + BcryptJS encryption
*   **In-Memory Database**: MongoDB Memory Server (development/testing sandbox)

---

## 📦 Getting Started

### **Prerequisites**
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### **Installation**
1. Clone the repository and install all dependencies for both client and server:
   ```bash
   npm run install-all
   ```

2. Seed the development database with default labs, tests, and mock credentials:
   ```bash
   npm run seed
   ```

3. Launch the local development server (starts client on port `5173` and server on port `5001` concurrently):
   ```bash
   npm run dev
   ```

---

## 📁 Repository Structure
```
├── client/                 # React frontend application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable layout, lab, and tracking components
│   │   ├── context/        # Authentication & State providers
│   │   ├── pages/          # Home, Booking, Dashboards, Compare, search views
│   │   └── services/       # API integration endpoints
│   └── index.html          # Frontend mount
├── server/                 # Express backend API
│   ├── controllers/        # Route controllers (Auth, Booking, Labs, Reviews)
│   ├── models/             # Mongoose schemas (User, Lab, Booking, Test)
│   ├── routes/             # API Router endpoints
│   ├── seed/               # Database mock seed data scripts
│   └── server.js           # Server listen & Express configuration
└── package.json            # Monorepo run scripts
```

---

## 🤝 Contact
For platform queries, integration support, or compliance documentation, reach out to `support@diagnoslab.in`.
