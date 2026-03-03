import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-900 text-center px-6 transition-colors duration-300">

      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-8xl font-extrabold text-blue-600 dark:text-blue-400"
      >
        404
      </motion.h1>

      <h2 className="text-3xl font-semibold mt-4 text-gray-800 dark:text-slate-100">
        Oops! Page Not Found
      </h2>

      <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex gap-4 mt-6">
        <Link to="/">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
            Go Home
          </button>
        </Link>

        <Link to="/courses">
          <button className="px-6 py-2 bg-gray-800 dark:bg-slate-700 hover:bg-gray-900 dark:hover:bg-slate-600 text-white rounded-lg transition">
            Browse Courses
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;