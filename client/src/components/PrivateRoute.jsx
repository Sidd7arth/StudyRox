import ProtectedRoute from "./ProtectedRoute";

const PrivateRoute = ({ children, role }) => {
  return (
    <ProtectedRoute adminOnly={role === "admin"}>
      {children}
    </ProtectedRoute>
  );
};

export default PrivateRoute;
