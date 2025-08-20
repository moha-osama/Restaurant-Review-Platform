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
import ProtectedRoute from "./components/ProtectedRoute";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";

const queryClient = new QueryClient();

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

const AnimatedRoutes = () => {
  const location = useLocation();

  const RestaurantDetailPage = lazy(
    () => import("./pages/RestaurantDetailPage")
  );

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
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            <Suspense fallback={<Loading />}>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                // transition={pageTransition}
              >
                <RestaurantDetailPage />
              </motion.div>
            </Suspense>
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
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-hidden">
            <AnimatedRoutes />
          </main>

          {/* Luxury footer */}
          <footer className="mt-16 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"></div>
          </footer>
        </motion.div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
