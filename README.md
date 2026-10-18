 <p align="center">
  <img src="src/assets/hero-banner.png" alt="PropertyPulse AI Banner" width="100%"  >
</p>
 
 
 # 🤖 PropertyPulse AI

> An AI-powered receptionist and customer interaction platform designed to automate conversations, streamline inquiry management, and deliver intelligent customer experiences across modern web applications.

 <p align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>

<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>

<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>

<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>

<img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white"/>

</p>

## 🚀 Overview

**PropertyPulse AI** is an AI-powered receptionist and customer engagement platform designed to help businesses automate customer interactions, capture qualified leads, schedule appointments, and deliver fast, intelligent responses through conversational AI.

Built with a modern React and TypeScript architecture, the platform combines AI-driven conversations, secure authentication, real-time communication workflows, and responsive user experiences to streamline customer engagement across desktop and mobile devices.

---

## 🚨 The Problem

Businesses frequently lose potential customers because they cannot respond instantly to inquiries outside business hours or during periods of high demand. Manual appointment scheduling, delayed responses, and fragmented communication often result in missed opportunities and reduced customer satisfaction.

Traditional customer support workflows also require significant human effort, making it difficult for growing businesses to scale while maintaining consistent service quality.

---

## 💡 The Solution

PropertyPulse AI provides an AI-powered virtual receptionist capable of engaging customers in natural conversations, qualifying leads, answering common questions, and assisting with appointment scheduling.

Built using React, TypeScript, Firebase, OpenAI, and Twilio, the platform demonstrates how conversational AI can automate customer engagement while remaining scalable, secure, and responsive across devices.

The long-term vision extends beyond an AI receptionist to an intelligent customer engagement platform capable of supporting voice interactions, CRM integrations, predictive analytics, and multi-channel communication.

---

## ✨ Core Features

### 🤖 AI Assistant

- Natural language conversations
- AI-powered customer assistance
- Intelligent lead qualification
- Automated inquiry handling

---

### 📅 Customer Management

- Appointment scheduling
- Lead capture
- Customer inquiry management
- Conversation history

---

### 🔐 Security

- Firebase Authentication
- Protected routes
- Secure cloud storage
- Environment variable configuration

---

### ⚙️ Engineering

- Component-based React architecture
- Type-safe TypeScript development
- Modular project organization
- Responsive UI
- REST API integrations
- Context API state management

---

### 🚀 Future AI Vision

- Voice AI
- CRM automation
- Predictive lead scoring
- AI analytics
- WhatsApp Business
- Calendar intelligence

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Context API

### Backend & Services

- Firebase Authentication
- Cloud Firestore
- Twilio
- OpenAI API
- REST APIs

### Development Tools

- Vite
- Git & GitHub
- Postman

---

# 🏗 Architecture

```
                    Customer

                      │

                      ▼

          React + TypeScript Frontend

                      │

         Context API State Management

                      │

      Conversation & Business Logic Layer

          ┌──────────────┬──────────────┐

          ▼              ▼

     OpenAI API      Twilio Services

          │              │

          └───────┬──────┘

                  ▼

        Firebase Cloud Platform

     Authentication • Firestore • Storage
```

The platform follows a modular architecture designed for scalability, maintainability, and high-performance conversational workflows.

---

# 🚀 Getting Started

Follow the steps below to set up and run the project locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** or **pnpm**
- A **Firebase** project with Authentication and Firestore configured
- **Git**

Verify your installation:

```bash
node -v
npm -v
```

---

## 📦 Installation

Clone the repository and install the project dependencies.

```bash
git clone https://github.com/Sinsydev/Propertypulse-ai.git
cd Propertypulse-ai
npm install
```

---

## ⚙️ Environment Setup

Create a local environment file before running the application.

```bash
cp .env.example .env.local
```

Populate `.env.local` using the template provided in `.env.example` with your Firebase configuration.

### Required Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🧠 AI Server Setup

The AI server runs separately from the frontend and requires its own environment configuration.

Create `ai-server/.env` from `ai-server/.env.example` and populate the webhook,
Twilio authentication, and Firebase Admin settings.

```env
TWILIO_WEBHOOK_URL=https://your.public-domain.com/process-speech
TWILIO_AUTH_TOKEN=your_twilio_auth_token
ALLOWED_ORIGINS=http://localhost:5173
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\firebase-service-account.json
FIREBASE_PROJECT_ID=your-firebase-project-id
```

The Firebase service account must have Firestore access. Keep its JSON file outside
the repository, or provide its JSON content through the secret environment variable
`FIREBASE_SERVICE_ACCOUNT_JSON`. On Google Cloud, Application Default Credentials
can be used instead. Do not use the frontend Firebase API key for server-side writes.

Set the Twilio voice webhook to `https://your.public-domain.com/voice`. The voice
handler gathers speech and posts it to `TWILIO_WEBHOOK_URL`. Both webhook routes
validate Twilio's request signature before handling calls.

In business onboarding, enter the Twilio inbound number if it differs from the
business phone number. The inbound number is matched against `twilioNumber` first,
then the existing business `phone`; numbers are normalized before they are saved.
Calls with incomplete details or no business mapping are not saved as leads.

Start the AI backend from the `ai-server` folder:

```bash
npm install
npm start
```

The backend will listen on `http://localhost:5001` and the frontend will call it via `VITE_AI_BASE_URL`.

> **Note:** The application validates all required environment variables during startup. Missing or invalid configuration will cause the application to fail fast with a clear error message, helping prevent runtime issues and simplifying debugging.

> **Security:** Never commit `.env.local` or any file containing production credentials. Use `.env.example` as the template for local development.

---

▶️ Running the Development Server

Start the development server:

```bash
npm run dev
```

Then open your browser and navigate to:

```text
http://localhost:5173
```

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🏛️ Design Principles

PropertyPulse AI was designed around the following principles:

• Scalability
• Maintainability
• Performance
• User Experience
• Security
• Modularity
• AI-first Design

---

# 🚧 Technical Challenges

One of the most interesting engineering challenges was maintaining smooth AI conversations while ensuring the interface remained responsive and predictable during asynchronous API requests.

This was addressed through:

- Optimized component rendering
- Modular conversation architecture
- Efficient asynchronous request handling
- Clean state management
- Responsive UI updates

---

# 📈 Performance & User Experience

Key improvements included:

- Faster conversational response handling
- Reduced unnecessary component re-renders
- Improved mobile responsiveness
- Scalable frontend architecture
- Smooth conversational workflows
- Enhanced user navigation

---

# 🎯 Project Impact

PropertyPulse AI demonstrates how conversational AI can transform customer communication by reducing manual workload and improving response times.

Beyond the technical implementation, the project strengthened my experience in building production-oriented AI interfaces, scalable React applications, and responsive user experiences.

---

# 📚 What I Learned

This project deepened my understanding of:

- AI-assisted frontend development
- Prompt-driven application workflows
- Scalable React architecture
- API integration patterns
- Responsive conversational UI
- Performance optimization
- Building production-ready SaaS applications

---

# 🔮 Future Enhancements

- Voice AI integration
- Multi-language support
- CRM integrations
- Calendar synchronization
- AI analytics dashboard
- Team collaboration tools
- WhatsApp integration
- Advanced customer insights

---

# 👨‍💻 About This Case Study

This repository exists to showcase the engineering approach behind PropertyPulse AI while protecting proprietary business logic and implementation details.

If you'd like to discuss the project or learn more about my work, feel free to connect.

---

# 🤝 Connect With Me

**Ismail Aminu Said**

🌐 Portfolio  
https://ismailaminusaid.netlify.app

💼 LinkedIn  
https://linkedin.com/in/sinsy-dev

💻 GitHub  
https://github.com/Sinsydev

📧 Email  
ismailaminusaid1234@gmail.com

---

<div align="center">

### ⭐ Thanks for visiting!

**Building AI-powered products that solve real-world problems.**

</div>
