import { useEffect, useState } from "react";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [groupedCourses, setGroupedCourses] = useState({});
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/courses",
        {
          params: {
            keyword,
            page,
            limit: 8,
          },
        }
      );

      const fetchedCourses = data.courses || data;

      setCourses(fetchedCourses);
      setTotalPages(data.totalPages || 1);

      // Group by category
      const grouped = fetchedCourses.reduce((acc, course) => {
        if (!acc[course.category]) acc[course.category] = [];
        acc[course.category].push(course);
        return acc;
      }, {});

      setGroupedCourses(grouped);

    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [keyword, page]);

  return (
    <div className="pt-24 px-8 bg-gray-50 min-h-screen">

      {/* 🔍 SEARCH BAR */}
      <div className="max-w-3xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search category / courses..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}

          className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 📚 COURSES */}
      {Object.keys(groupedCourses).length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No courses found.
        </div>
      ) : (
        Object.keys(groupedCourses).map((category) => (
          <div key={category} className="mb-14">

            {/* Category Title */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-4">
              {category}
            </h2>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedCourses[category].map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                >
                  <img
                    src={course.image}
                    alt={course.courseName}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {course.courseName}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {course.description?.substring(0, 60)}...
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-blue-600 font-bold text-lg">
                        ${course.price}
                      </span>

                      <span className="text-yellow-500 text-sm">
                        ⭐ {course.rating}
                      </span>
                    </div>

                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))
      )}

      {/* 📄 PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default Courses;