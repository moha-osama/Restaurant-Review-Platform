import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

interface RestaurantCardProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  image: string;
  location: string;
  onClick: () => void;
}

const RestaurantCard = ({
  id,
  name,
  description,
  rating,
  image,
  location,
  onClick,
}: RestaurantCardProps) => {
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

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="relative mb-6">
        <img
          src={image}
          alt={name}
          className="w-full h-52 object-cover rounded-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/400x300/E3CAA0/775924?text=Restaurant";
          }}
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 flex items-center space-x-1 shadow-lg">
          {renderStars(rating)}
        </div>
      </div>

      <div className="space-y-3">
        <h3
          className="text-xl font-bold leading-tight"
          style={{ color: "var(--night)" }}
        >
          {name}
        </h3>

        <p
          className="text-sm leading-relaxed font-light"
          style={{ color: "var(--dim-gray)" }}
        >
          {description}
        </p>

        <div
          className="flex items-center space-x-2 pt-2"
          style={{ color: "var(--dim-gray)" }}
        >
          <FaMapMarkerAlt className="text-sm" />
          <span className="text-sm font-medium">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
