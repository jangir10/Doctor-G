# Doctor-G

Doctor-G is a comprehensive full-stack application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled using Tailwind CSS. The application is powered by Vite for faster development and includes a Frontend, Backend, and Admin Portal.

## Features
- User and Admin authentication with JSON Web Tokens (JWT).
- User-friendly interface for patients and doctors.
- Admin portal for managing users and system data.
- Secure backend API.
- Styled with Tailwind CSS for responsive and modern design.

---

## Sections

### 1. Frontend
The frontend is built with React.js and Tailwind CSS, providing an interactive and responsive user interface.

#### Key Features:
- User authentication with JWT.
- Dynamic pages for doctors, appointments, and user profiles.
- Seamless navigation using React Router.
- Optimized for performance using Vite.

#### Installation:
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

### 2. Backend
The backend is powered by Node.js and Express.js, managing all server-side logic and database operations.

#### Key Features:
- RESTful APIs for user and admin functionalities.
- MongoDB as the database for storing user, doctor, and appointment data.
- Authentication and authorization with JWT.

#### Installation:
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file with the following variables:
     ```env
     PORT=5000
     MONGO_URI=<your_mongodb_connection_string>
     JWT_SECRET=<your_jwt_secret>
     ```
4. Start the server:
   ```bash
   npm start
   ```

---

### 3. Admin Portal
The Admin Portal is a separate interface for administrators to manage the application.

#### Key Features:
- Admin authentication with JWT.
- User and appointment management.
- Dashboard for insights and statistics.

#### Installation:
1. Navigate to the `admin-portal` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Technologies Used
- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/jangir10/Doctor-G
   ```
2. Follow the installation steps for the Frontend, Backend, and Admin Portal.
3. Run the application:
   - Start the backend server.
   - Start the frontend and admin development servers.
4. Access the application in your browser at `http://localhost:3000` for the frontend and `http://localhost:3001` for the admin portal.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**Happy Coding!**
