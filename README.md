# 📧 Email Spam Report Tool

A full-stack web application designed to test email deliverability by analyzing where an email lands across multiple inboxes (Inbox, Spam, or Promotions).  
This project was built as a **72-hour assignment** for a Full Stack Developer Internship.

**Live Demo URL:** [Your Vercel Deployed URL Here]

---

## 🖥️ UI Preview
A preview of the clean and modern user interface.

---

## 🚀 Key Features

- **Real-time Deliverability Testing:**  
  Programmatically checks 5 real email inboxes to determine if an email landed in the Inbox or Spam folder.

- **Simple 3-Step Process:**  
  A clear and intuitive user flow — start a test to get a code, send the email, and analyze the results.

- **Unique Test Code:**  
  Generates a unique code for each test to accurately identify and track the corresponding email.

- **Instant Email Reports:**  
  Delivers a beautifully formatted HTML report of the results directly to the user's email address.

- **Polished User Interface:**  
  A modern, responsive UI built with React and Tailwind CSS, featuring clear loading and success states to guide the user.

- **Bonus – Deliverability Score:**  
  Calculates and displays an overall deliverability score based on how many emails successfully reached the inbox.

---

## ⚙️ How It Works (Architecture)

The application follows a simple, robust **client-server architecture**.

### 1️⃣ Test Initiation (Frontend → Backend)
- The user enters their email address on the React frontend and clicks **"Start Test"**.
- A `POST` request is sent to `/api/test/start`.
- The Node.js/Express backend creates a new test entry in the **Supabase database**, generating a unique `test_code`.
- The backend responds with the `test_code`.

### 2️⃣ Email Analysis (User → Backend)
- The user sends an email containing the `test_code` to the 5 designated Zoho test inboxes.
- The user clicks **"Analyze Now"** on the frontend, which triggers a `GET` request to `/api/test/analyze/:testCode`.
- The backend’s **Zoho IMAP service** (using `imapflow`) connects to all 5 test inboxes.
- It searches both the `INBOX` and `Spam` folders for the test code.

### 3️⃣ Report Generation (Backend → Frontend & User)
- The backend compiles results into a JSON object and saves them in Supabase.
- Using **Nodemailer**, a formatted HTML report is emailed to the user.
- The backend also responds with the JSON data so the frontend can display a live deliverability report.

---

## 🛠️ Tech Stack

| Area | Technology / Service |
|------|----------------------|
| **Frontend** | React (Vite), Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Mail Service** | IMAP Protocol (`imapflow`) with Zoho Mail |
| **Email Sending** | Nodemailer |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📂 Setup and Installation (Run Locally)

Follow these steps to run the project on your machine:

### ✅ Prerequisites
- Node.js (v18+)
- npm or yarn
- Free [Supabase](https://supabase.com/) account
- 5 Zoho Mail accounts (for testing)
- 1 email account for sending reports (Zoho recommended)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
````

---

### 2️⃣ Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Fill `.env` with your credentials (Supabase keys, Zoho app passwords, etc.)

---

### 3️⃣ Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local
```

Set in `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

---

### 4️⃣ Running the Application

* **Run Backend:**

  ```bash
  npm run dev
  ```

  Server starts at → [http://localhost:5000](http://localhost:5000)

* **Run Frontend:**

  ```bash
  npm run dev
  ```

  Opens React app at → [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### **POST** `/api/test/start`

**Description:** Initiates a new deliverability test.
**Body:**

```json
{ "userEmail": "example@email.com" }
```

**Response:**

```json
{ "message": "...", "testCode": "..." }
```

---

### **GET** `/api/test/analyze/:testCode`

**Description:** Analyzes all test inboxes for the provided code.
**Response:**

```json
{ "success": true, "results": [ ... ] }
```

---

## 📈 Future Improvements

Even though this version is fully functional, here’s what I’d improve next:

* **Shareable Report Links:**
  Add a `GET /api/test/report/:testId` endpoint to serve reports publicly.

* **Multi-Provider Support:**
  Expand to Gmail/Outlook by re-enabling OAuth-based IMAP in the modular `services` folder.

* **PDF Export:**
  Client-side PDF generation of reports (e.g., with `jsPDF`).

* **User Test History:**
  Add authentication to store and display users’ previous test results.

---

## 🗂️ Folder Structure

```
/frontend
  ├── src/
  │   ├── App.jsx
  │   └── components/
  └── .env.local

/server
  ├── config/
  │   ├── db.js
  │   └── zoho.js
  ├── controllers/
  │   └── testController.js
  ├── routes/
  │   └── testRoutes.js
  ├── services/
  │   └── zohoService.js
  ├── utils/
  │   └── mailer.js
  ├── server.js
  └── .env
```

This structure keeps the **frontend** and **backend** cleanly separated within one repository.

