# 🚀 AI Course Generator

### Learn Smarter. Create Faster. Powered by AI.

An AI-powered learning platform that transforms any topic into a structured learning experience with automatically generated course outlines, chapters, and educational content.

Create personalized courses, explore your learning materials, and manage your courses with the power of Artificial Intelligence.

---

## ✨ What Makes It Special?

- 🤖 **AI-Powered Course Generation** – Generate personalized course layouts using Google Gemini AI.
- 📚 **Smart Chapter Generation** – Automatically generate detailed educational content for each chapter.
- 🎨 **AI-Generated Course Banners** – Create topic-specific course banners using Cloudflare AI and FLUX.
- ☁️ **Cloudinary Image Storage** – Store AI-generated banners and manually uploaded course images.
- 🖼️ **Change Course Banner** – Upload custom course banners directly from your device.
- 🔐 **Secure Authentication** – Personalized accounts and authentication using Clerk.
- 📊 **Personal Course Dashboard** – Manage and access your generated courses.
- 🔎 **Personalized Explore Page** – View your own courses without displaying other users' private courses.
- 📖 **Start Learning** – Access chapters and automatically generated learning content.
- 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile devices.
- 💎 **Free & Pro Plans** – Flexible course generation options.
- 💳 **Online Payments** – Monthly and yearly Pro subscriptions through Razorpay.

---

## 🛠️ Built With

| Technology | Usage |
|---|---|
| Next.js 14 | Full-stack application framework |
| React.js | User interface |
| JavaScript | Application logic |
| Tailwind CSS | Responsive styling |
| Google Gemini AI | Course layouts and educational content |
| Cloudflare Workers AI | AI-powered banner prompt generation |
| FLUX AI | Course banner image generation |
| Cloudinary | AI banner and manual image storage |
| Neon PostgreSQL | Database |
| Drizzle ORM | Database queries and management |
| Clerk | Authentication and user management |
| Razorpay | Subscription payments |
| Vercel | Application deployment |

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [AI Banner Generation and Storage](#-ai-banner-generation-and-storage)
- [Tech Stack](#-tech-stack)
- [Subscription Plans](#-subscription-plans)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [What I Learned](#-what-i-learned)
- [Future Enhancements](#-future-enhancements)
- [About the Developer](#-about-the-developer)

---

## 🌟 About the Project

AI Course Generator is an intelligent learning platform designed to make course creation easier, faster, and more accessible.

Instead of manually preparing course outlines and educational materials, users can simply enter a topic and let Artificial Intelligence generate a structured course.

Users can create personalized courses in different categories, generate detailed chapter content, manage their learning materials, and start learning from an organized course interface.

Whether you want to learn Programming, Web Development, Technology, or Creative Skills, this platform helps transform your learning ideas into structured educational experiences.

### 🎯 Project Goals

- Simplify course creation using Artificial Intelligence.
- Generate structured and personalized learning content.
- Provide AI-generated course banners.
- Offer reliable image storage for course banners.
- Provide an easy-to-use course management dashboard.
- Make AI-powered learning accessible through Free and Pro plans.
- Deliver a responsive learning experience across desktop and mobile devices.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 AI Course Generation | Generate personalized course layouts using Google Gemini AI. |
| 📚 Chapter Generation | Automatically create detailed educational content for course chapters. |
| 🎨 AI Course Banners | Generate course-specific banners using Cloudflare AI and FLUX. |
| ☁️ Cloudinary Storage | Store generated banners and manually uploaded images in Cloudinary. |
| 🖼️ Change Banner | Upload and update course banners from your device. |
| 🔐 Secure Authentication | User registration and login using Clerk. |
| 📊 Personal Dashboard | Manage and access your generated courses. |
| 🔎 Explore Courses | View your own generated courses with pagination. |
| 📖 Start Learning | Open course chapters and access learning content. |
| 📱 Responsive UI | Optimized for mobile phones, tablets, and desktop screens. |
| 💎 Subscription System | Free and Pro subscription plans. |
| 💳 Razorpay Integration | Monthly and yearly subscription payments. |
| 🗄️ Database Management | Store course details, chapter content, and subscription information. |

---

## 🖥️ Screenshots

Here are some previews of the application.

Replace these placeholders with your actual project screenshots.

### 🏠 Homepage
<!-- Add homepage screenshot here -->

### 📊 Dashboard
<!-- Add dashboard screenshot here -->

### 🤖 AI Course Generation
<!-- Add course generation screenshot here -->

### 📖 Course Layout and Start Learning
<!-- Add course layout and learning screenshot here -->

### 🎨 AI Course Banner and Change Banner
<!-- Add banner screenshot here -->

### 💎 Upgrade to Pro
<!-- Add pricing page screenshot here -->

---

## 🎨 AI Banner Generation and Storage

The platform uses Cloudflare AI and Cloudinary to provide an automated course banner generation and image management workflow.

### AI-Generated Course Banners

1. The user enters a course topic, category, and description.
2. Cloudflare Llama AI creates a detailed image-generation prompt.
3. FLUX AI generates a course-specific banner.
4. The generated image is uploaded to Cloudinary.
5. The Cloudinary image URL is saved in the Neon PostgreSQL database.
6. The generated banner is displayed on the Course Layout page.

### Manual Change Banner

Users can also upload their own course banner.

1. Select an image from a device.
2. The image is uploaded through a secure Next.js API route.
3. Cloudinary stores the uploaded image.
4. The course record is updated with the new image URL.
5. The updated banner appears on the Course Layout page.

Both AI-generated and manually uploaded course banners use Cloudinary storage, allowing the application to use the same image storage system on localhost and Vercel.

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React.js
- JavaScript
- Tailwind CSS
- HTML5 and CSS3

### Backend
- Next.js API Routes
- Node.js
- Clerk Authentication

### Database and ORM
- Neon PostgreSQL
- Drizzle ORM

### Artificial Intelligence
- Google Gemini AI
- Cloudflare Workers AI
- FLUX AI

### Image Storage
- Cloudinary
- Cloudinary Node.js SDK

### Payment Integration
- Razorpay Subscription API

### Deployment
- Vercel
- GitHub

---

## 💎 Subscription Plans

The platform provides flexible subscription options.

| Plan | Price | Course Generation |
|---|---:|---|
| 🆓 Free | ₹0 | 5 lifetime courses |
| ⭐ Pro Monthly | ₹199/month | Unlimited |
| 👑 Pro Yearly | ₹999/year | Unlimited |

### 🆓 Free Plan
- Create up to 5 lifetime courses.
- Generate personalized course layouts.
- Access generated learning materials.

### ⭐ Pro Plan
- Unlimited course generation while the subscription is active.
- Monthly or yearly subscription options.
- Access to the platform's AI-powered learning features.

### 💳 Payment Integration
Razorpay is integrated to manage monthly and yearly Pro subscriptions.

---

## ⚙️ Installation Guide

Want to run this project locally? Follow these steps.

### 1. Clone Repository

```bash
git clone https://github.com/PradeepKumar7662/AI-Course-Generator.ai.git
```

### 2. Navigate to Project

```bash
cd AI-Course-Generator.ai
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root directory and add the required API credentials.

Refer to the [Environment Variables](#-environment-variables) section.

### 5. Setup Database

```bash
npx drizzle-kit push
```

Make sure your Neon PostgreSQL database connection is configured correctly.

### 6. Start Development Server

```bash
npm run dev
```

### 7. Open in Browser

```text
http://localhost:3000
```

🎉 Your AI Course Generator is ready to run locally!

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

# Cloudflare AI - Course Banner Generation
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=

# Cloudinary - Image Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_MONTHLY_PLAN_ID=
RAZORPAY_YEARLY_PLAN_ID=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

**Security Notes:**

- Never commit `.env.local` to GitHub.
- Never expose secret API keys in client-side code.
- Keep Cloudinary API Secret server-side only.
- Configure the same required environment variables in Vercel.
- Use appropriate environment settings for Production and Preview deployments.

---

## 📂 Project Structure

```text
AI-Course-Generator.ai/
│
├── app/
│   ├── api/
│   │   ├── course/
│   │   │   └── [courseId]/
│   │   │       ├── route.js
│   │   │       └── chapter/
│   │   │           └── [chapterId]/
│   │   │               └── route.js
│   │   │
│   │   ├── courses/
│   │   ├── explore/
│   │   ├── generate-course/
│   │   ├── generate-banner/
│   │   ├── save-banner/
│   │   ├── razorpay/
│   │   └── subscription/
│   │
│   ├── dashboard/
│   │   └── explore/
│   │
│   ├── create-course/
│   │   ├── [courseId]/
│   │   │   └── components/
│   │   │       └── CourseBasicInfo.jsx
│   │   └── page.jsx
│   │
│   ├── sign-in/
│   └── sign-up/
│
├── components/
│
├── configs/
│   ├── AiModel.jsx
│   ├── cloudinary.js
│   ├── db.jsx
│   └── schema.jsx
│
├── public/
│
├── drizzle/
│
├── middleware.js
├── next.config.mjs
├── package.json
└── README.md
```

---

## 🎓 What I Learned

While developing this project, I gained practical experience in:

- Building full-stack web applications using Next.js.
- Integrating Google Gemini AI for dynamic course generation.
- Using Cloudflare AI and FLUX for AI-generated course banners.
- Integrating Cloudinary for image uploads and storage.
- Implementing authentication with Clerk.
- Managing PostgreSQL databases using Drizzle ORM.
- Building and securing REST API endpoints.
- Implementing user-specific course access.
- Integrating Razorpay subscription payments.
- Managing Free and Pro subscription logic.
- Deploying full-stack applications using Vercel.
- Working with environment variables and third-party APIs.
- Debugging and handling production deployment issues.

---

## 🚀 Future Enhancements

- [ ] Course progress tracking.
- [ ] Downloadable course certificates.
- [ ] Course ratings and reviews.
- [ ] Personalized AI learning recommendations.
- [ ] Improved learning analytics.
- [ ] Course bookmarking and favorites.
- [ ] More AI-powered learning features.

---

## 👨‍💻 About the Developer

**Pradeep Kumar**  
MCA Graduate | Aspiring Full Stack Developer

I enjoy building practical web applications and exploring how Artificial Intelligence can improve digital learning experiences.

<p align="center">
  <a href="https://github.com/PradeepKumar7662">
    <img src="https://img.shields.io/badge/GitHub-PradeepKumar7662-181717?style=for-the-badge&logo=github" />
  </a>
</p>

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.

Your support motivates me to build more useful projects!

<p align="center">
  <b>Made with ❤️ by Pradeep Kumar</b>
</p>

<p align="center">
  🚀 Learn Smarter. Create Faster. Powered by AI.
</p>
