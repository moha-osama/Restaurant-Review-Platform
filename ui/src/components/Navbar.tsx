import { Link } from "react-router-dom";
import { FaUtensils, FaUser, FaSignInAlt, FaSpinner, FaTrophy } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isLoggedIn, user, isLoading, logout } = useAuth();

  const getInitial = (name?: string) => {
    if (!name) return <FaUser />;
    return (
      <span className="bg-yellow-400 text-white rounded-full flex items-center justify-center w-10 h-10 text-xl font-bold">
        {name.split(" ")[0][0]}
      </span>
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div>
            <Link
              to="/"
              className="flex items-center space-x-3"
              style={{ color: "var(--selective-yellow)" }}
            >
              <FaUtensils className="text-3xl" />
              <span className="text-2xl font-bold tracking-wide">
                Restaurant Reviews
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/leaderboard"
                className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <FaTrophy className="text-lg" />
                <span>Leaderboard</span>
              </Link>
            </div>

            {isLoading ? (
              // Show loading spinner while checking auth status
              <div className="flex items-center space-x-2">
                <FaSpinner className="animate-spin text-yellow-400" />
              </div>
            ) : isLoggedIn && user ? (
              // Show user profile and logout option
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                    />
                  ) : (
                    getInitial(user.name)
                  )}
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Show login button for non-authenticated users
              <Link
                to="/auth"
                className="btn-primary flex items-center space-x-2 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
