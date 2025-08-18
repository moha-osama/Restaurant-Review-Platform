import { Link } from "react-router-dom";
import { FaUtensils, FaUser, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<{
    name?: string;
    profilePicture?: string;
  } | null>(null);

  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}users/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json(); // ← Added 'await' here!
          setUser({
            name: data.name,
            profilePicture: data.profilePicture,
          });

          // Use navigate instead of window.location.href for better UX
          navigate("/"); // ← Better than window.location.href

          // OR if you want to stay on current page, remove this line entirely
        } else {
          console.error("Failed to fetch user profile");
          setUser(null); // ← Clear user state on failure
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // ← Handle network errors
      }
    };

    fetchUser();
  }, []);

  const getInitial = (name?: string) => {
    if (!name) return <FaUser />;
    return (
      <span className="bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
        {name.split(" ")[0][0]}
      </span>
    );
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
            {user ? (
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
              </Link>
            ) : (
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
