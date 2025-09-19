import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus, FaEdit, FaTrash, FaStore, FaTimes } from "react-icons/fa";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

interface Restaurant {
  id: string;
  name: string;
  location: string;
  description: string | null;
  avg_rating: string;
  avg_sentiment: string;
  created_at: string;
  avgRating: number | null;
  avgSentiment: number | null;
}

interface OwnerRestaurantsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Modal Component
interface RestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; location: string }) => void;
  isEditing: boolean;
  formData: { name: string; location: string };
  setFormData: (data: { name: string; location: string }) => void;
  isLoading: boolean;
}

const RestaurantModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  formData,
  setFormData,
  isLoading,
}: RestaurantModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black h-screen w-screen transition-opacity duration-300 ease-in-out z-40 ${
          isOpen ? "opacity-60" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out ${
            isOpen 
              ? "scale-100 translate-y-0 opacity-100" 
              : "scale-95 translate-y-4 opacity-0"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: "var(--night)" }}>
                {isEditing ? "Edit Restaurant" : "Add New Restaurant"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="transform transition-all duration-200 ease-out">
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--dim-gray)" }}>
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter restaurant name"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
              <div className="transform transition-all duration-200 ease-out">
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--dim-gray)" }}>
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter restaurant location"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
              <div className="flex gap-3 pt-4 transform transition-all duration-200 ease-out">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FaStore className="text-sm" />
                  )}
                  {isEditing ? "Update Restaurant" : "Add Restaurant"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const OwnerRestaurants = ({ user }: OwnerRestaurantsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const queryClient = useQueryClient();

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Disable scroll on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Cleanup function to restore scroll
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isModalOpen]);

  // Fetch user's restaurants
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["user-restaurants"],
    queryFn: async () => {
      const response = await fetch(`${BASE_API_URL}/restaurants/my-restaurants`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Add restaurant mutation
  const addRestaurantMutation = useMutation({
    mutationFn: async (data: { name: string; location: string }) => {
      const response = await fetch(`${BASE_API_URL}/restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add restaurant");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-restaurants"] });
      handleCloseModal();
    },
  });

  // Update restaurant mutation
  const updateRestaurantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; location: string } }) => {
      const response = await fetch(`${BASE_API_URL}/restaurants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update restaurant");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-restaurants"] });
      handleCloseModal();
    },
  });

  // Delete restaurant mutation
  const deleteRestaurantMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_API_URL}/restaurants/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete restaurant");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-restaurants"] });
    },
  });

  const handleOpenModal = (restaurant?: Restaurant) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setFormData({
        name: restaurant.name,
        location: restaurant.location,
      });
    } else {
      setEditingRestaurant(null);
      setFormData({ name: "", location: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRestaurant(null);
    setFormData({ name: "", location: "" });
  };

  const handleSubmit = (data: { name: string; location: string }) => {
    if (editingRestaurant) {
      updateRestaurantMutation.mutate({
        id: editingRestaurant.id,
        data,
      });
    } else {
      addRestaurantMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      deleteRestaurantMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "var(--selective-yellow)" }}
          ></div>
          <p className="mt-4 text-sm" style={{ color: "var(--dim-gray)" }}>
            Loading your restaurants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold" style={{ color: "var(--night)" }}>
          My Restaurants
        </h3>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl"
        >
          <FaPlus className="text-sm" />
          Add Restaurant
        </button>
      </div>

      {/* Restaurants List */}
      <div className="space-y-4">
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <FaStore className="text-6xl mx-auto mb-4" style={{ color: "var(--dim-gray)" }} />
            <h4 className="text-xl font-semibold mb-2" style={{ color: "var(--night)" }}>
              No restaurants yet
            </h4>
            <p className="text-gray-600 mb-4">
              Start by adding your first restaurant to manage reviews and ratings.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="btn-primary px-6 py-2 rounded-xl flex items-center gap-2 mx-auto"
            >
              <FaPlus className="text-sm" />
              Add Your First Restaurant
            </button>
          </div>
        ) : (
          restaurants.map((restaurant: Restaurant) => (
            <div
              key={restaurant.id}
              className="card p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2" style={{ color: "var(--night)" }}>
                    {restaurant.name}
                  </h4>
                  <p className="text-gray-600 mb-2">
                    <strong>Location:</strong> {restaurant.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Rating:</span>
                      <span className="text-yellow-600">
                        {restaurant.avgRating ? restaurant.avgRating.toFixed(1) : "No reviews"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Reviews:</span>
                      <span>{restaurant.avgRating ? "Active" : "No reviews yet"}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(restaurant)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit restaurant"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete restaurant"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Restaurant Modal */}
      <RestaurantModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isEditing={!!editingRestaurant}
        formData={formData}
        setFormData={setFormData}
        isLoading={addRestaurantMutation.isPending || updateRestaurantMutation.isPending}
      />

      {/* Error Messages */}
      {(addRestaurantMutation.error || updateRestaurantMutation.error || deleteRestaurantMutation.error) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">
            {addRestaurantMutation.error?.message ||
              updateRestaurantMutation.error?.message ||
              deleteRestaurantMutation.error?.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default OwnerRestaurants;
