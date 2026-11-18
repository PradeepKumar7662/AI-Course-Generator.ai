# 🚀 AI Course Generator

### Learn Smarter. Create Faster. Powered by AI.

An AI-powered learning platform that transforms any topic into a structured course with automatically generated chapters and learning content.

Create, explore, and manage personalized courses with the power of Artificial Intelligence.

---

### ✨ What Makes It Special?

- 🤖 **AI-Powered Learning** – Generate complete courses using AI.
- 📚 **Smart Chapters** – Automatically create structured learning content.
- 🎨 **AI Course Banners** – Create attractive course visuals.
- 🔐 **Secure Login** – Personalized accounts and authentication.
- 📊 **Course Dashboard** – Manage all your generated courses.
- 💎 **Free & Pro Plans** – Flexible course generation options.
- 💳 **Online Payments** – Secure subscription payments with Razorpay.

---

### 🛠️ Built With

| Technology | Usage |
|---|---|
| Next.js 14 | Full-stack framework |
| React.js | User interface |
| JavaScript | Application logic |
| Tailwind CSS | Responsive styling |
| Google Gemini AI | AI course generation |
| Neon PostgreSQL | Database |
| Drizzle ORM | Database queries |
| Clerk | Authentication |
| Razorpay | Subscription payments |

---

**Developed by Pradeep Kumar | MCA Graduate & Aspiring Full Stack Developer**

---

## 📌 Table of Contents

- [🌟 About the Project](#-about-the-project)
- [✨ Key Features](#-key-features)
- [🖥️ Screenshots](#️-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [💎 Subscription Plans](#-subscription-plans)
- [⚙️ Installation Guide](#️-installation-guide)
- [🔐 Environment Variables](#-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🚀 Future Enhancements](#-future-enhancements)
- [👨‍💻 Author](#-author)

---

## 🌟 About the Project

**AI Course Generator** is a smart learning platform designed to make course creation easier, faster, and more accessible.

Instead of manually preparing course outlines and chapters, users can simply enter a topic and let Artificial Intelligence generate structured course content.

Whether you want to learn Programming, Web Development, Technology, or Creative Skills, this platform helps turn your learning ideas into organized courses.

### 🎯 Project Goals

- Simplify the course creation process using AI.
- Generate structured and personalized learning content.
- Provide an easy-to-use course management dashboard.
- Make AI-powered learning accessible through Free and Pro plans.

---

## ✨ Key Features

| Feature                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| 🤖 AI Course Generation  | Generate courses using Google Gemini AI.                     |
| 📚 Chapter Generation    | Automatically create structured course chapters and content. |
| 🎨 AI Course Banners     | Generate attractive course banners.                          |
| 🔐 Secure Authentication | User registration and login using Clerk.                     |
| 📊 Personal Dashboard    | Manage and access generated courses.                         |
| 🔎 Explore Courses       | Browse available courses with pagination.                    |
| 📱 Responsive UI         | Designed for desktop and mobile devices.                     |
| 💳 Subscription System   | Free and Pro subscription plans.                             |
| 💰 Razorpay Integration  | Monthly and yearly subscription payments.                    |
| 🗄️ Database Management  | Store course and subscription information.                   |

---

## 🖥️ Screenshots

Here is a preview of the application.

> Replace these image paths with your actual screenshots.

### 🏠 Homepage



### 📊 Dashboard



### 🤖 AI Course Generation



### 📖 Generated Course



### 💎 Upgrade to Pro



---

## 🛠️ Tech Stack

### Frontend

- Next.js 14
- React.js
- JavaScript
- Tailwind CSS
- HTML5 & CSS3

### Backend

- Next.js API Routes
- Node.js
- Clerk Authentication

### Database & ORM

- Neon PostgreSQL
- Drizzle ORM

### Artificial Intelligence

- Google Gemini AI
- AI-powered course content generation
- Course banner generation

### Payment Integration

- Razorpay Subscription API

---

## 💎 Subscription Plans

The platform offers flexible subscription options.

| Plan          |      Price | Course Generation  |
| ------------- | ---------: | ------------------ |
| 🆓 Free       |         ₹0 | 5 lifetime courses |
| ⭐ Pro Monthly | ₹199/month | Unlimited          |
| 👑 Pro Yearly |  ₹999/year | Unlimited          |

**Free Plan:** Users can create up to 5 lifetime courses.

**Pro Plan:** Users get unlimited course generation through an active subscription.

---

## ⚙️ Installation Guide

Want to run this project on your local machine? Follow these steps.

### 1️⃣ Clone Repository

```bash
git clone https://github.com/PradeepKumar7662/AI-Course-Generator.ai.git
```

### 2️⃣ Navigate to Project

```bash
cd AI-Course-Generator.ai
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory and configure your API credentials.

### 5️⃣ Setup Database

```bash
npx drizzle-kit push
```

### 6️⃣ Start Development Server

```bash
npm run dev
```

### 7️⃣ Open in Browser

```text
http://localhost:3000
```

🎉 Congratulations! Your AI Course Generator is ready to run locally.

---

## 🔐 Environment Variables

Configure the following environment variables in your `.env.local` file.

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# Google Gemini AI
GEMINI_API_KEY=

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_MONTHLY_PLAN_ID=
RAZORPAY_YEARLY_PLAN_ID=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

Also add any Cloudflare-related credentials required by your banner generation implementation.

**⚠️ Security Note:** Never commit `.env.local`, secret API keys, database credentials, or payment secrets to GitHub.

---

## 📂 Project Structure

```text
AI-Course-Generator.ai/
│
├── app/
│   ├── api/
│   │   ├── course/
│   │   ├── courses/
│   │   ├── explore/
│   │   ├── generate-course/
│   │   ├── generate-banner/
│   │   ├── razorpay/
│   │   └── subscription/
│   │
│   ├── dashboard/
│   ├── create-course/
│   ├── course/
│   ├── sign-in/
│   └── sign-up/
│
├── components/
├── configs/
├── public/
├── drizzle/
├── middleware.js
├── package.json
└── README.md
```

---

## 🚀 Future Enhancements

- [ ] Course progress tracking.
- [ ] Downloadable course certificates.
- [ ] Course ratings and reviews.
- [ ] Personalized AI learning recommendations.
- [ ] Improved learning analytics.
- [ ] More AI-powered learning features.

---

## 🎓 What I Learned

While developing this project, I gained practical experience in:

- Building full-stack applications using Next.js.
- Integrating AI APIs for dynamic content generation.
- Implementing authentication with Clerk.
- Managing PostgreSQL databases using Drizzle ORM.
- Building REST API endpoints.
- Integrating Razorpay subscription payments.
- Managing free and paid subscription logic.
- Deploying applications using Vercel.

---

## 👨‍💻 About the Developer

\<p align="center">   \<b>Pradeep Kumar\</b>\<br/>   MCA Graduate | Aspiring Full Stack Developer \</p>

\<p align="center">   \<a href="[https://github.com/PradeepKumar7662](https://github.com/PradeepKumar7662)">     \<img src="[https://img.shields.io/badge/GitHub-PradeepKumar7662-181717?style=for-the-badge&logo=github](https://img.shields.io/badge/GitHub-PradeepKumar7662-181717?style=for-the-badge\&logo=github)" />   \</a> \</p>

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.

Your support motivates me to build more useful projects!

\<p align="center">   \<b>Made with ❤️ by Pradeep Kumar\</b> \</p>

\<p align="center">   🚀 Empowering Learning Through Artificial Intelligence 🚀 \</p>

