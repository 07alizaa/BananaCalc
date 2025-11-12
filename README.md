# 🍌 BananaCalc - Interactive Math Puzzle Game

BananaCalc is a **full-stack web application** where users solve banana-themed arithmetic puzzles. Built with **React**, **Node.js**, and **MySQL**, it features **real-time scoring, JWT authentication, and leaderboards**.

---

## 📋 Features

- Interactive arithmetic puzzles with banana-themed visuals  
- Dynamic puzzle generation using Banana API with local fallback  
- Real-time scoring and instant feedback  
- Leaderboard showing top players  
- Secure user registration and login with **JWT authentication**  
- Mobile-friendly responsive design using Tailwind CSS  

---

## 🛠 Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express.js, MySQL, bcryptjs, JWT, dotenv, CORS  

---

## ⚡ Setup

### 1. Clone the repo
```bash
git clone <repo-url>
cd BananaCalc
2. Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file (use .env.example as reference):

ini
Copy code
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bananacalc
JWT_SECRET=your_jwt_secret
BANANA_API_BASE=http://marcconrad.com/uob/banana
Start backend server:

bash
Copy code
npm run dev
Runs on: http://localhost:4000

3. Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm start
Runs on: http://localhost:5173

```
## 🔑 Environment Variables

- `BANANA_API_BASE`: URL for Banana API (external puzzle provider)  
- `JWT_SECRET`: Secret key for signing JWT tokens  
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: MySQL database connection  

> Make sure `.env` is **not committed to Git**.

---

## 🏗 Architecture

- **Service-Based Architecture**: Backend separated into controllers, models, and services  
- **Controllers**: Handle HTTP requests and responses (`authController`, `gameController`, `leaderboardController`)  
- **Models**: Database operations (`authModel`, `gameModel`, `leaderboardModel`)  
- **Services**: External integrations and business logic (`bananaService`)  
- **Frontend**: React UI components, pages, routing, and API service layer  

---

## 🔒 Security Measures

- Password hashing using `bcryptjs`  
- JWT-based authentication for stateless sessions  
- SQL queries parameterized to prevent injection  
- CORS restricted to frontend origin  
- Environment variables stored in `.env` (gitignored)  

---

## 👨‍💻 Developer

Aliza Simkhada - @07alizaa

---

## 🙏 Acknowledgments

- Banana API by Marc Conrad - [http://marcconrad.com/uob/banana](http://marcconrad.com/uob/banana)  
- University of Bedfordshire - CIS046-3 Module
