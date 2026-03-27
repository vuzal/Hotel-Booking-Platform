

# 🏨 DublStay - Modern Hotel Booking Platform

DublStay is a comprehensive, full-stack hotel reservation system designed to provide a seamless booking experience for guests and a powerful management dashboard for administrators. 

🚀 **[Experience DublStay Live](https://hotel-booking-platform-sch6.vercel.app/)** *(Note: As the backend is hosted on a free cloud tier, the initial request might take 30-50 seconds to wake up the server. Thank you for your patience!)*

## ✨ Key Features
- **Smart Authentication:** JWT-based user registration with an optimized, instant auto-login flow.
- **Role-Based Access Control (RBAC):** Distinct interfaces and secure routing for `USER` and `ADMIN` roles.
- **Advanced Admin Dashboard:** Real-time statistics, revenue tracking, and complete CRUD operations for Hotels and Rooms.
- **Reservation Management:** Dynamic booking system with real-time status tracking (Pending, Confirmed, Completed, Cancelled).
- **Responsive & Modern UI:** Fully optimized for mobile and desktop using modern CSS techniques, slide-out menus, and smooth animations.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Icons & UI:** Lucide React, Radix UI (shadcn/ui concepts)
- **Deployment:** Vercel

### Backend
- **Core:** Java 21, Spring Boot 3
- **Security:** Spring Security, JWT (JSON Web Tokens), CORS configurations
- **Data Access:** Spring Data JPA, Hibernate
- **Database:** PostgreSQL
- **Deployment:** Render (Cloud)

## 💻 Getting Started (Local Development)

If you want to run this project locally, follow these steps:

### Prerequisites
- Node.js (v18+)
- Java 17+
- Gradle
- PostgreSQL installed and running

### 1. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/vuzal/Hotel-Booking-Platform.git]

# Navigate to backend directory
cd backend

# Configure your database credentials in application.yml or application.properties

# Run the Spring Boot application
mvn spring-boot:run
```
*The backend API will start on `http://localhost:8080`*

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file and link the local API
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Start the development server
npm run dev
```
*The frontend will start on `http://localhost:3000`*

---
**Developed by Vusal** 