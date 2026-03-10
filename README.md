# 🎬 TheShow - Fullstack Movie Ticket Booking Platform

## Overview
**TheShow** is a full-stack web application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It replicates and enhances the core functionalities of existing ticket-booking systems like **BookMyShow**, enabling users to:

- Browse movies and show timings
- Select seats and book tickets
- Make secure online payments via **Stripe**
- Receive instant booking confirmations via **email**

👉 **Live Demo:** [theshow.onrender.com](https://theshow.onrender.com)

This project demonstrates **production-ready architecture**, **secure flows**, and **scalable deployment**.

---

## ✨ Features

### 🔑 Authentication & Authorization
- JWT-based authentication stored in HTTP-only cookies
- Role-based access control for **Admin**, **Partner**, and **User**

### 👨‍💼 Admin Role
- Manage movies (CRUD operations)
- Approve theatres and customers
- Access user-level features

### 🎭 Partner Role
- Manage theatres (CRUD operations)
- Create and edit shows
- View bookings for owned theatres
- Access user-level features

### 🎟️ User Role
- Browse movies and shows
- Select seats and confirm bookings
- Pay securely via **Stripe**
- Receive tickets via **email**

### ⚙️ Common Features
- Register/Login/Logout
- Password reset via email
- Shared user capabilities across roles

---

## 💳 Payments Integration
- **Stripe** payment gateway for secure transactions
- Frontend: React + Stripe Elements for card input
- Backend: Node.js + Stripe SDK for PaymentIntent creation
- Webhooks for payment confirmation, refunds, and disputes
- Email delivery triggered on successful payment

---

## 🔐 Security
- **bcrypt** for password hashing
- Middleware protections:
  - `express-rate-limit` (brute-force prevention)
  - `express-mongo-sanitize` (NoSQL injection protection)
  - `helmet` (secure HTTP headers)
- JWT stored in **HTTP-only secure cookies**

---

## 🚀 Deployment
- Hosted on **Render** using a **mono-repo** (client + server)
- Features:
  - Continuous deployment via GitHub
  - Shared `.env` configuration
  - Automatic SSL (HTTPS)
  - Scalable runtime environment

---

## 🛠️ Technologies Used
- **MongoDB** → NoSQL database for movies, theatres, bookings
- **Express.js** → Backend REST APIs
- **React.js** → Frontend UI with reusable components
- **Node.js** → Runtime environment for backend services
- **Stripe** → Payment gateway
- **Brevo API** → Email notifications

---

## 📸 Application Walkthrough
### User Experience
- Browse and filter movies
- View show details
- Select seats and confirm booking
- Pay via Stripe
- Receive tickets via email

### Admin Experience
- Manage movies (CRUD)
- Approve/block theatres
- Verify customers

### Partner Experience
- Manage theatres and shows
- View bookings
- Search bookings by text

---

## 📈 Key Takeaways
- MERN stack integration for scalable applications
- Secure authentication and payment flows
- Real-world viability with email + OTP integration
- Deployment-ready with Render mono-repo setup

---

## ⚠️ Limitations & Future Improvements
- Stripe fees may impact small-scale deployments
- Email API costs (Brevo free tier limitations)
- Render free tier cold starts
- Seat locking logic can be improved with **real-time sockets**
- Personalized dashboards for different user roles

### Suggestions
- Explore open-source alternatives for email/OTP (Firebase, Twilio)
- Implement caching/CDN for frontend performance
- Containerized deployment with **Docker + Railway/Fly.io**

---

## 📚 References
- [Bootstrap Documentation](https://getbootstrap.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Brevo Docs](https://www.brevo.com/docs/)
- Git repositories by Chirag Goel, Mrinal Bhattacharya, Abhishek Goel & Uttam Sharma (BookMyShow clone tutorials)

---

## 👨‍💻 Author
**Arunava Basak**  
Master’s Project Report submitted to **Scaler Neovarsity - Woolf**  
Email: *arunavabasak01@gmail.com*

---

## 📜 License
This project is for academic and learning purposes.  
Feel free to fork and experiment, but please provide attribution if reused.
