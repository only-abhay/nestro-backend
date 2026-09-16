# AI Workspace — Backend

This repository contains the backend API for **AI Workspace**, an AI-powered application for blog generation and resume-based interview preparation.

The backend is built using **Node.js, Express.js, MongoDB**, and integrates external AI and payment services.

## 📂 Frontend Repository

[AI Workspace Frontend](https://github.com/only-abhay/AI-Assistant-frontend)

## ✨ Features

* User authentication
* JWT-based authentication
* OTP email verification
* Password hashing
* Protected APIs
* Role-based access control
* AI Blog Generation
* Resume-based Q&A generation
* Blog history
* Resume history
* Free plan usage limits
* Unlimited paid plan
* Razorpay payment integration
* Payment verification
* MongoDB database
* CORS configuration
* Cookie-based authentication

## 🤖 AI Integration

### Groq API — Blog Generator

The backend uses the **Groq API** for AI-powered blog generation.

Users provide:

```text
Title
Keywords
Description
```

The backend sends these details to the Groq API and returns the generated blog content.

The generated content is stored in MongoDB.

### Google Gemini — Resume Q&A

The backend uses **Google Gemini** for resume analysis.

Users upload:

* Resume PDF
* Job Description

The backend processes the request and generates interview questions and answers.

The response contains:

```text
id
question
answer
priority
```

## 💳 Subscription & Payment System

AI Workspace provides two plans.

### Free Plan

The free plan allows users to generate up to **10 blogs**.

The backend tracks the user's usage and prevents additional blog generation after reaching the limit.

### Unlimited Plan

Users can purchase the Unlimited plan through Razorpay.

The backend handles:

1. Razorpay order creation
2. Payment verification
3. Razorpay signature verification
4. Transaction storage
5. Plan activation
6. Idempotency handling

## 🔐 Authentication

Authentication is implemented using:

* JWT
* HTTP cookies
* Password hashing
* OTP verification
* Email verification
* Protected middleware
* Role-based access control

The authentication flow includes:

```text
Register
   ↓
OTP Verification
   ↓
Login
   ↓
JWT Cookie
   ↓
Protected API
```

## 👥 Roles

The application supports different user roles:

```text
User
Admin
Super Admin
```

Role-based middleware is used to restrict access to protected resources.

## 🗄️ Database

MongoDB is used as the primary database.

Main data includes:

* Users
* Blogs
* Resume data
* Subscription/Pass information
* Payment information

MongoDB is connected using Mongoose.

## 🏗️ Architecture

The backend follows an MVC-style structure.

```text
Backend
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── UserController.js
│   ├── BlogController.js
│   ├── ResumeController.js
│   └── PassController.js
│
├── models/
│   ├── UserModel.js
│   ├── BlogModel.js
│   ├── PassModel.js
│   └── ...
│
├── routes/
│   ├── UserRouter.js
│   ├── BlogRouter.js
│   ├── ResumeRouter.js
│   └── ...
│
├── middleware/
│   └── authMiddleware.js
│
├── services/
│   ├── aiservices.js
│   └── gemini.js
│
├── utils/
│   └── ...
│
└── server.js
```

## 🔌 API Modules

### User APIs

Used for:

* Registration
* Login
* OTP verification
* Logout
* User authentication

### Blog APIs

Used for:

* Generate blog
* Save blog
* Get blog history
* Manage generated blogs

### Resume APIs

Used for:

* Upload resume
* Process job description
* Generate interview Q&A
* Save resume history

### Payment APIs

Used for:

* Create Razorpay order
* Verify payment
* Activate Unlimited plan

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/only-abhay/AI-Assistant-backend.git
```

Go to the backend directory:

```bash
cd AI-Assistant-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY_FOR_ENCRPT=your_secret_key

GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

## 🔒 Environment Variables

Never commit your `.env` file to GitHub.

Make sure `.env` is included in `.gitignore`.

Example:

```text
.env
.env.local
node_modules/
```

## 🔄 Application Flow

```text
User
 │
 ▼
Next.js Frontend
 │
 ▼
Express.js REST API
 │
 ├── Authentication
 │
 ├── Blog Generator ──► Groq API
 │
 ├── Resume Q&A ──────► Gemini API
 │
 ├── Payment ─────────► Razorpay
 │
 └── Database ────────► MongoDB
```

## 🚀 Deployment

The backend can be deployed on services such as Render or other Node.js hosting platforms.

Production deployment requires configuring the environment variables and frontend CORS URL.

## 🔮 Future Improvements

* Streaming AI responses
* More AI-powered tools
* Advanced resume scoring
* Cover letter generation
* Email notifications
* Admin analytics
* Subscription management
* Rate limiting
* Improved API validation

## 👨‍💻 Author

**Abhay Shaw**

Full Stack Developer
