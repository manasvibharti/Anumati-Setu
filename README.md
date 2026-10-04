# AnumatiSetu — Business Compliance & Statutory Approval Platform

> **Smart India Hackathon (SIH) Prototype**  
> **Problem Statement ID:** SIH26130 — *Efficiency in streamlining industrial approvals, compliance processes, and access to government support services*

---

## 🌟 Overview

**AnumatiSetu** is an intelligent full-stack automation platform designed to simplify regulatory compliance, statutory clearances, and license renewal lifecycles for Indian businesses and industrial enterprises.

---

## 💻 How to Run the Application

The platform uses a **Node.js Express backend** with **MySQL database** persistence and a modern frontend.

### Option 1: Quick Launch (Windows)
Double-click [`start.bat`](file:///c:/Users/manas/.gemini/antigravity/scratch/start.bat) in the project root. It will automatically start the server and open `http://localhost:4000` in your default browser.

### Option 2: Using Terminal / PowerShell

1. Open your terminal in this directory (`c:\Users\manas\.gemini\antigravity\scratch`).
2. Make sure your MySQL database is running on port 3306 (configured in `.env`).
3. Start the backend server:
   ```bash
   npm start
   ```
4. Open your web browser and navigate to:
   ```
   http://localhost:4000
   ```

> [!NOTE]
> Opening HTML files directly via `file:///` without starting the backend server will cause a **"Failed to fetch"** error because the frontend needs the Node.js API server running on port 4000.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend**: Node.js, Express.js, REST API
* **Database**: MySQL (Connection Pooling with `mysql2/promise`)
* **Authentication**: Multi-tenant token-based authentication with isolated data per user

---

## 📄 License
Developed for Smart India Hackathon &copy; 2026 AnumatiSetu Team.
