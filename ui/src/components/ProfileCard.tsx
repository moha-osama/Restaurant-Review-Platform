import { FaEnvelope, FaCalendar, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
  avatar?: string;
}

interface ProfileCardProps {
  user: User;
  onLogout: () => void;
}

const ProfileCard = ({ user, onLogout }: ProfileCardProps) => {
  return (
    <div className="card text-center border border-gray-100 shadow-xl">
      <div className="mb-8 flex flex-col items-center">
        {user.avatar ? (
          <img loading="lazy" 
            src={user.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-yellow-400"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
            {user.name.split(" ")[0][0]}
          </div>
        )}
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--night)" }}
        >
          {user?.name}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          {user?.role === "owner" ? (
            <FaStore className="text-lg" style={{ color: "var(--selective-yellow)" }} />
          ) : (
            <FaUser className="text-lg" style={{ color: "var(--selective-yellow)" }} />
          )}
          <span className="text-sm font-medium capitalize" style={{ color: "var(--dim-gray)" }}>
            {user?.role}
          </span>
        </div>
      </div>

      <div className="space-y-0 text-left">
        <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
          <FaEnvelope
            className="text-xl"
            style={{ color: "var(--selective-yellow)" }}
          />
          <span className="font-medium" style={{ color: "var(--dim-gray)" }}>
            {user?.email}
          </span>
        </div>

        <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
          <FaCalendar
            className="text-xl"
            style={{ color: "var(--selective-yellow)" }}
          />
          <span className="font-medium" style={{ color: "var(--dim-gray)" }}>
            Joined {new Date(user?.createdAt || "").toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* <button className="btn-primary w-full mt-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"> */}
      {/* Edit Profile */}
      {/* </button> */}
      <button
        className="w-full mt-4 py-3 rounded-2xl font-semibold shadow hover:shadow-lg transition-all duration-300 flex flex-row-reverse items-center justify-center gap-2"
        style={{ backgroundColor: "#dc2626", color: "#fff", cursor: "pointer" }}
        onClick={onLogout}
      >
        <FaSignOutAlt className="text-lg" />
        Sign Out
      </button>
    </div>
  );
};

export default ProfileCard;
