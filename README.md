# Real-time-Payment-Booking-Management-System
Features:Full-stack booking & payment platform with Stripe integration, PDF receipt & QR code generation, cancellation & refund workflow, admin dashboard, and notifications.

Tech Stack
Frontend: React, MUI, Stripe.js, jsPDF, html2canvas, qrcode.react, react-toastify
Backend: Node.js, Express, MongoDB (Mongoose), Stripe SDK, JWT, bcryptjs
Testing & CI: Playwright/Cypress (E2E), Postman/Newman (API), k6 (load)

Setup & Run Locally
Clone repo:
git clone https://github.com/<your-username>/<repo>.git
cd <repo>

Backend:
cd backend
npm install
# Add .env 
npm start

Frontend:
cd frontend
npm install
npm start

Key Features
User booking & payment with Stripe Checkout/Elements

PDF receipt generation & QR code ticketing

Payment cancellation requests and admin refund approval

Admin dashboard: booking management, refunds, analytics

Notifications via react-toastify
