import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AuthPage from "./pages/AuthPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
};

// AnimatedRoutes component for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              // transition={pageTransition}
            >
              <RestaurantsPage />
            </motion.div>
          }
        />
        <Route
          path="/auth"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              // transition={pageTransition}
            >
              <AuthPage />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              // transition={pageTransition}
            >
              <DashboardPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <motion.div
          className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatedRoutes />
          </main>

          {/* Luxury footer */}
          <motion.footer
            className="mt-16 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p
                className="text-sm font-light"
                style={{ color: "var(--dim-gray)" }}
              >
                © 2024 Restaurant Review Platform. Crafted with ❤️ for food
                lovers.
              </p>
            </div>
          </motion.footer>
        </motion.div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
