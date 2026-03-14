# 🍽️ NivasFoods - Modern MERN Restaurant App

A high-performance, full-stack restaurant management and ordering application built with the MERN stack. Designed with a sleek UI and packed with features like real-time search, secure payments, and administrative product management.



## 🚀 Features

### **User Experience**
- **Dynamic Homepage**: Featured product carousels and fresh vegetable sections.
- **Real-Time Search**: Instant filtering of products by name or category.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop using Tailwind CSS.
- **Smart Cart**: Persist items in cart with intuitive quantity management.
- **Advanced Filtering**: Toggle-based category filtering for quick menu navigation.

### **Security & Auth**
- **Secure Authentication**: User signup and login with profile picture uploads.
- **Password Protection**: Industry-standard password hashing using `bcryptjs`.
- **JWT Authorization**: (Ready for expansion) Secure token-based session management.
- **Protected Routes**: Payment and administrative features restricted to authorized users.

### **Admin & Business**
- **Admin Dashboard**: Exclusive access for admins to upload and manage new menu products.
- **Secure Payments**: Integrated with **Stripe API** for safe and seamless transactions.
- **Automated Fallbacks**: Smart loading states and sample data fallbacks ensuring 100% uptime.

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux Toolkit, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Payments**: Stripe API
- **Icons & UI**: React Icons, React Hot Toast

## 📦 Installation & Setup

### **Prerequisites**
- Node.js installed
- MongoDB (Local or Atlas account)
- Stripe account (for API keys)

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/radhanivas18/MERN_restaurant.git
cd MERN_restaurant
```

### **Step 2: Backend Configuration**
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file:
```env
MONGODB_URL = "your_mongodb_connection_string"
STRIPE_SECRET_KEY = "your_stripe_secret_key"
FRONTEND_URL = "http://localhost:3000"
PORT = 8080
```
4. Start the server: `npm run dev`

### **Step 3: Frontend Configuration**
1. Navigate to the frontend folder: `cd ../frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file:
```env
REACT_APP_SERVER_DOMIN = "http://localhost:8080"
REACT_APP_ADMIN_EMAIL = "your-admin-email@example.com"
REACT_APP_STRIPE_PUBLIC_KEY = "your_stripe_public_key"
```
4. Start the app: `npm start`



---

## 👨‍💻 Author
**Radhanivas**

If you find this project helpful, give it a ⭐ to show your support! ❇️
