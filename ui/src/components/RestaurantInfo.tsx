import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";

interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  description: string | null;
  avg_rating: string;
  avg_sentiment: string;
  created_at: string;
  avgRating: number | null;
  avgSentiment: number | null;
}

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card border border-gray-100 shadow-xl overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80">
        <img loading="lazy" 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop"
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/1200x400/E3CAA0/775924?text=Restaurant";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg">
          <Rating
            className="flex"
            readonly
            initialValue={parseFloat(restaurant.avg_rating) || 0}
            size={28}
            SVGstyle={{ display: "inline" }}
            fillColor="var(--selective-yellow)"
            emptyColor="var(--dim-gray)"
          />
          <span className="font-bold text-lg" style={{ color: "var(--night)" }}>
            {parseFloat(restaurant.avg_rating).toFixed(1) || "0.0"}
          </span>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "var(--night)" }}
          >
            {restaurant.name}
          </h1>

          <div className="flex items-center space-x-4 text-lg">
            <div
              className="flex items-center space-x-2"
              style={{ color: "var(--dim-gray)" }}
            >
              <FaMapMarkerAlt />
              <span className="font-medium">{restaurant.location}</span>
            </div>

            <div
              className="flex items-center space-x-2"
              style={{ color: "var(--dim-gray)" }}
            >
              <FaClock />
              <span className="font-medium">
                Since {formatDate(restaurant.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {restaurant.description && (
          <div className="space-y-3">
            <h3
              className="text-xl font-semibold"
              style={{ color: "var(--night)" }}
            >
              About
            </h3>
            <p
              className="text-lg leading-relaxed font-light"
              style={{ color: "var(--dim-gray)" }}
            >
              {restaurant.description}
            </p>
          </div>
        )}

        {/* Stats */}
      </div>
    </div>
  );
};

export default RestaurantInfo;
