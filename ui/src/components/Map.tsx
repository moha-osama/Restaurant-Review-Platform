import { FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface MapProps {
  selectedRestaurant?: {
    name: string;
    location: string;
    coordinates: { lat: number; lng: number };
  };
}

const Map = ({ selectedRestaurant }: MapProps) => {
  return (
    <motion.div 
      className="card h-full min-h-[500px] relative border border-gray-100 shadow-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="absolute inset-0 rounded-2xl flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--white) 0%, #f8fafc 50%, var(--dim-gray) 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          {selectedRestaurant ? (
            <motion.div 
              key="selected"
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div 
                className="bg-white rounded-full p-6 shadow-xl border border-yellow-100"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <FaMapMarkerAlt
                  className="text-4xl"
                  style={{ color: "var(--selective-yellow)" }}
                />
              </motion.div>
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--night)" }}>
                  {selectedRestaurant.name}
                </h3>
                <p className="text-base font-medium mb-3" style={{ color: "var(--dim-gray)" }}>
                  {selectedRestaurant.location}
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-mono" style={{ color: "var(--dim-gray)" }}>
                    {selectedRestaurant.coordinates.lat.toFixed(4)},{" "}
                    {selectedRestaurant.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="default"
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div 
                className="bg-white rounded-full p-6 shadow-xl border border-gray-100"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <FaMapMarkerAlt
                  className="text-4xl"
                  style={{ color: "var(--dim-gray)" }}
                />
              </motion.div>
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--night)" }}>
                  Select a Restaurant
                </h3>
                <p className="text-base font-light" style={{ color: "var(--dim-gray)" }}>
                  Click on a restaurant card to see its location and details
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map placeholder overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(123, 113, 107, 0.1) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.div 
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-100"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <span className="text-sm font-medium" style={{ color: "var(--dim-gray)" }}>
            Map View
          </span>
        </motion.div>
        
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(123, 113, 107, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(123, 113, 107, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Map;
