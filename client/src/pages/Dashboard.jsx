import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {user?.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
        </h1>

        {/* User Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Welcome back <span className="font-bold text-2xl text-yellow-600">{user?.name || "Student"}</span>👋
          </h2>

        </div>
        <Link to="/courses">
          <div className="flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
              }}
            >
              Browse Courses
            </motion.button>
          </div>
        </Link>

        {/* Stats Section */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Enrolled Courses</h3>
            <p className="text-3xl font-bold mt-2">5</p>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Completed</h3>
            <p className="text-3xl font-bold mt-2">2</p>
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Certificates</h3>
            <p className="text-3xl font-bold mt-2">1</p>
          </div>
        </div> */}

        {/* Recent Courses */}
        {/* <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Continue Learning
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-700">
                Full Stack Web Development
              </span>
              <Link
                to="/courses"
                className="text-blue-600 font-medium hover:underline"
              >
                Go to Course →
              </Link>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-700">
                Data Structures & Algorithms
              </span>
              <Link
                to="/courses"
                className="text-blue-600 font-medium hover:underline"
              >
                Go to Course →
              </Link>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default Dashboard;