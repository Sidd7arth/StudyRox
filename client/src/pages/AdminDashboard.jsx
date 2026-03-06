import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("http://localhost:5000/api/admin/users", config);
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const getUserStatus = (u) => {
    if (u.lastLogin) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Logged in: {formatDate(u.lastLogin)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        Signed up: {formatDate(u.createdAt)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name || user?.email || "Admin"}</span>!
          </p>
        </div>

        {/* Users Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-semibold leading-6 text-slate-900 dark:text-white">
              User Accounts
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              A list of all users and their current status.
            </p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-slate-500 dark:text-slate-400">
                <div className="animate-spin inline-block w-8 h-8 md:w-10 md:h-10 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full" role="status" aria-label="loading">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4 text-sm font-medium">Loading users...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/10 m-6 rounded-lg font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-900 dark:text-white">
                        {u.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {u.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {getUserStatus(u)}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
