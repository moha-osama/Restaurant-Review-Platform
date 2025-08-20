import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

interface RestaurantCardProps {
  id: string;
  name: string;
  description?: string | null;
  rating: number;
  image: string;
  location: string;
  onClick?: () => void;
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
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/restaurant/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
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
        <div className="absolute top-3 right-3 bg-white rounded-3xl pb-2 pt-1 px-4 shadow-lg backdrop-blur-sm">
          <Rating
            readonly
            initialValue={rating}
            size={24}
            SVGstyle={{ display: "inline" }}
            fillColor="var(--selective-yellow)"
            emptyColor="var(--dim-gray)"
          />
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
          {description || "No description available"}
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
