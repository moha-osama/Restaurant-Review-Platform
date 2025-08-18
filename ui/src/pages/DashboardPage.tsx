import { useQuery } from "@tanstack/react-query";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaStar,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Mock data - replace with actual API calls
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  joinedDate: "2024-01-15",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

const mockReviews = [
  {
    id: "1",
    restaurantName: "The Golden Fork",
    rating: 4.5,
    comment:
      "Excellent Italian food! The pasta was perfectly cooked and the service was outstanding.",
    date: "2024-08-10",
    restaurantImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    restaurantName: "Sakura Sushi Bar",
    rating: 5.0,
    comment:
      "Amazing sushi! Fresh ingredients and beautiful presentation. Highly recommend the chef's special.",
    date: "2024-08-05",
    restaurantImage:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    restaurantName: "Le Petit Bistro",
    rating: 4.0,
    comment:
      "Charming French bistro with authentic cuisine. The coq au vin was delicious.",
    date: "2024-07-28",
    restaurantImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop",
  },
];

const DashboardPage = () => {
  // Mock API calls using TanStack Query
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => Promise.resolve(mockUser),
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["user-reviews"],
    queryFn: () => Promise.resolve(mockReviews),
  });

  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        style={{
          color: index < rating ? "var(--selective-yellow)" : "var(--dim-gray)",
          fontSize: "0.875rem",
        }}
      />
    ));
  };

  const handleSignOut = async () => {
    fetch(`${import.meta.env.VITE_BASE_API_URL}users/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          navigate("/auth");
        } else {
          throw new Error("Failed to sign out");
        }
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (userLoading || reviewsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto"
            style={{ borderColor: "var(--selective-yellow)" }}
          ></div>
          <p
            className="mt-6 text-lg font-medium"
            style={{ color: "var(--dim-gray)" }}
          >
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1
          className="text-5xl font-bold mb-4 tracking-tight"
          style={{ color: "var(--night)" }}
        >
          Your Dashboard
        </h1>
        <p className="text-xl font-light" style={{ color: "var(--dim-gray)" }}>
          Manage your profile and review your dining experiences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="card text-center border border-gray-100 shadow-xl">
            <div className="mb-8">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-4 border-yellow-100 shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/150/E3CAA0/775924?text=User";
                }}
              />
              <h2
                className="text-3xl font-bold tracking-tight"
                style={{ color: "var(--night)" }}
              >
                {user?.name}
              </h2>
            </div>

            <div className="space-y-5 text-left">
              <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <FaEnvelope
                  className="text-xl"
                  style={{ color: "var(--selective-yellow)" }}
                />
                <span
                  className="font-medium"
                  style={{ color: "var(--dim-gray)" }}
                >
                  {user?.email}
                </span>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <FaCalendar
                  className="text-xl"
                  style={{ color: "var(--selective-yellow)" }}
                />
                <span
                  className="font-medium"
                  style={{ color: "var(--dim-gray)" }}
                >
                  Joined {new Date(user?.joinedDate || "").toLocaleDateString()}
                </span>
              </div>
            </div>

            <button className="btn-primary w-full mt-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Edit Profile
            </button>
            <button
              className="w-full mt-4 py-3 rounded-2xl font-semibold shadow hover:shadow-lg transition-all duration-300 flex flex-row-reverse items-center justify-center gap-2"
              style={{ backgroundColor: "#dc2626", color: "#fff" }}
              onClick={handleSignOut}
            >
              <FaSignOutAlt className="text-lg" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="lg:col-span-2">
          <div className="card border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3
                className="text-3xl font-bold tracking-tight"
                style={{ color: "var(--night)" }}
              >
                Your Reviews
              </h3>
              <span
                className="text-lg font-medium px-4 py-2 bg-yellow-50 rounded-full"
                style={{ color: "var(--dim-gray)" }}
              >
                {reviews?.length} reviews
              </span>
            </div>

            <div className="space-y-6">
              {reviews?.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-yellow-200"
                >
                  <div className="flex items-start space-x-5">
                    <img
                      src={review.restaurantImage}
                      alt={review.restaurantName}
                      className="w-20 h-20 rounded-xl object-cover shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/100/E3CAA0/775924?text=Restaurant";
                      }}
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4
                          className="text-xl font-bold"
                          style={{ color: "var(--night)" }}
                        >
                          {review.restaurantName}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      <p
                        className="text-base leading-relaxed mb-4 font-light"
                        style={{ color: "var(--dim-gray)" }}
                      >
                        {review.comment}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full"
                          style={{ color: "var(--dim-gray)" }}
                        >
                          {new Date(review.date).toLocaleDateString()}
                        </span>

                        <div className="flex items-center space-x-3">
                          <button
                            className="p-2 rounded-lg hover:bg-yellow-50 transition-colors duration-200"
                            style={{ color: "var(--selective-yellow)" }}
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            style={{ color: "var(--dim-gray)" }}
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {reviews?.length === 0 && (
                <div className="text-center py-16">
                  <div
                    className="text-8xl mb-6"
                    style={{ color: "var(--dim-gray)" }}
                  >
                    🍽️
                  </div>
                  <p
                    className="mb-4 text-xl font-medium"
                    style={{ color: "var(--dim-gray)" }}
                  >
                    You haven't written any reviews yet.
                  </p>
                  <p
                    className="text-base font-light"
                    style={{ color: "var(--dim-gray)" }}
                  >
                    Start exploring restaurants and share your dining
                    experiences!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
