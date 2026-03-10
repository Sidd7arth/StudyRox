# StudyRox

StudyRox is an AI-powered Learning Management System (LMS) designed for managing educational courses and providing intelligent study assistance. This full-stack application leverages modern web technologies and a dedicated AI microservice to create an interactive and supportive learning environment.

This project is ideal for students and educators seeking an interactive learning platform with AI support. It also serves as an excellent learning resource for developers interested in MERN stack development combined with microservices architecture and AI integration.

## ✨ Features

*   **Secure User Authentication**: Allows users to securely register, log in, and manage their profiles.
*   **Comprehensive Course Management**: Provides tools for creating, managing, and enrolling in various online courses.
*   **Intelligent AI Study Assistant**: Offers personalized study help and answers questions using advanced AI capabilities.
*   **Customizable AI Personalities**: Users can tailor the AI assistant's personality to match their learning style or preference.
*   **Admin and User Dashboards**: Separate interfaces for administrators to manage the platform and for users to track their learning progress.

## 🛠️ Tech Stack

StudyRox is built with a robust and modern technology stack:

*   **Frontend**: React
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **AI Service**: Python
*   **AI Model**: Google Gemini

## 📁 Project Structure

StudyRox is organized into three main services, allowing for a clear separation of concerns and scalability:

*   **`client/`**: The frontend application built with React, providing the user interface and experience.
*   **`server/`**: The backend API, built with Node.js and Express.js, handling user authentication, course management, and database interactions with MongoDB.
*   **`llm-service/`**: A dedicated Python microservice responsible for integrating with the Google Gemini API to provide intelligent AI study assistance.

## 🚀 Getting Started

Follow these steps to set up and run StudyRox on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: (LTS version recommended)
*   **npm** or **Yarn**: (Comes with Node.js or can be installed separately)
*   **Python**: (3.8+ recommended)
*   **pip**: (Comes with Python)
*   **MongoDB**: (Local installation or a cloud service like MongoDB Atlas)
*   **Git**: For cloning the repository.

### Environment Variables

Each service requires its own environment variables for configuration. Create a `.env` file in the root directory of `server/` and `llm-service/` respectively.

#### `llm-service/.env`

```
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
```
*   **`GEMINI_API_KEY`**: Obtain your API key from Google AI Studio.

#### `server/.env`

```
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=A_VERY_STRONG_RANDOM_SECRET_KEY
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=youradmin@example.com
ADMIN_PASSWORD=youradminpassword
```
*   **`MONGO_URI`**: Your MongoDB connection string (e.g., `mongodb://localhost:27017/studyrx` or your MongoDB Atlas connection string).
*   **`JWT_SECRET`**: A strong, random string used to sign JSON Web Tokens.
*   **`PORT`**: The port the backend server will run on (e.g., `5000`).
*   **`NODE_ENV`**: Set to `development` for local development.
*   **`ADMIN_EMAIL`**: Email for the initial admin user.
*   **`ADMIN_PASSWORD`**: Password for the initial admin user.

### Installation Steps

1.  **Clone the Repository**

    Open your terminal or command prompt and run:

    ```bash
    git clone https://github.com/your-username/StudyRox.git
    cd StudyRox
    ```
    Replace `https://github.com/your-username/StudyRox.git` with the actual repository URL.

2.  **Backend Setup (`server`)**

    Navigate into the `server` directory, install dependencies, and start the server.

    ```bash
    cd server
    npm install # or yarn install
    ```

    Create the `.env` file as described above.

    **Seed Initial Data (Optional but Recommended)**
    To create an initial admin user and populate some default data (check `seedAdmin.js` for details on what it seeds):

    ```bash
    node seedAdmin.js
    ```

    Start the backend server:

    ```bash
    npm start # or node server.js
    ```
    The server will typically run on `http://localhost:5000`.

3.  **AI Microservice Setup (`llm-service`)**

    Open a **new terminal window**, navigate into the `llm-service` directory, install Python dependencies, and start the service.

    ```bash
    cd ../llm-service
    pip install -r requirements.txt
    ```

    Create the `.env` file as described above with your `GEMINI_API_KEY`.

    Start the AI service:

    ```bash
    python app.py
    ```
    This service will typically run on `http://localhost:3001` (or the port configured within `app.py`).

4.  **Frontend Setup (`client`)**

    Open another **new terminal window**, navigate into the `client` directory, install dependencies, and start the development server.

    ```bash
    cd ../client
    npm install # or yarn install
    npm run dev # or yarn dev
    ```
    The frontend application will usually open in your browser at `http://localhost:5173` (or another port as indicated by your terminal output).

## 🚀 Usage

Once all three services (frontend, backend, and AI microservice) are running:

1.  Open your web browser and navigate to the client application (typically `http://localhost:5173`).
2.  Register a new user or log in with an existing account.
3.  Explore the various courses, manage your profile, and interact with the AI Study Assistant.
4.  If you have admin privileges (e.g., via the seeded admin account), access the Admin Dashboard to manage users and courses.
