import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaExclamationTriangle, FaStore, FaUserFriends, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "owner">("user");

  const { login, loginError, resetLoginError, signup, signupError, resetSignupError, isSignupPending } = useAuth();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => login(value),
  });

  // Clear error when switching between forms
  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
    // Clear any existing errors when switching forms
    if (loginError) {
      resetLoginError();
    }
    if (signupError) {
      resetSignupError();
    }
  };

  const signupForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user" as "user" | "owner",
    },
    onSubmit: async ({ value }) => {
      console.log("Signup:", value);
      signup(value);
    },
  });

  const handleRoleChange = (role: "user" | "owner") => {
    setSelectedRole(role);
    signupForm.setFieldValue("role", role);
  };

  return (
    <motion.div className=" flex items-start justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <motion.div className="max-w-md w-full space-y-8">
        <motion.div className="text-center">
          <h2
            className="text-4xl font-bold tracking-tight"
            style={{ color: "var(--night)" }}
          >
            {isLogin ? "Welcome Back" : "Join Our Community"}
          </h2>
          <p
            className="mt-3 text-lg font-light"
            style={{ color: "var(--dim-gray)" }}
          >
            {isLogin
              ? "Sign in to continue your culinary journey"
              : "Create an account to start exploring"}
          </p>
          <motion.p
            className="mt-4 text-sm"
            style={{ color: "var(--dim-gray)" }}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <motion.button
              onClick={handleFormSwitch}
              className="font-semibold hover:underline transition-all duration-200"
              style={{ color: "var(--selective-yellow)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </motion.button>
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <form
              key="login"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                loginForm.handleSubmit();
              }}
              className="card space-y-6 border border-gray-100 shadow-xl"
            >
              {/* Error Message */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">
                    Email or password is wrong. Please try again.
                  </p>
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "var(--night)" }}
                >
                  Email address
                </label>
                <div className="relative">
                  <FaEnvelope
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--dim-gray)" }}
                  />
                  <loginForm.Field
                    name="email"
                    children={(field) => (
                      <input
                        id="email"
                        type="email"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          // Clear error when user starts typing
                          if (loginError) {
                            resetLoginError();
                          }
                        }}
                        className="input-field pl-12 pr-4 py-3 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    )}
                  />
                </div>
              </div>

              <motion.div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "var(--night)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--dim-gray)" }}
                  />
                  <loginForm.Field
                    name="password"
                    children={(field) => (
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          // Clear error when user starts typing
                          if (loginError) {
                            resetLoginError();
                          }
                        }}
                        className="input-field pl-12 pr-12 py-3 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
                        placeholder="Enter your password"
                      />
                    )}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    style={{ color: "var(--dim-gray)" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div>
                <loginForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <motion.button
                      type="submit"
                      className="btn-primary w-full py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={!canSubmit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </motion.button>
                  )}
                />
              </motion.div>
            </form>
          ) : (
            <motion.form
              key="signup"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                signupForm.handleSubmit();
              }}
              className="card space-y-6 border border-gray-100 shadow-xl"
            >
              {/* Error Message */}
              {signupError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">
                    {signupError.message}
                  </p>
                </motion.div>
              )}

              <motion.div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "var(--night)" }}
                >
                  Full name
                </label>
                <div className="relative">
                  <FaUser
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--dim-gray)" }}
                  />
                  <signupForm.Field
                    name="name"
                    children={(field) => (
                      <input
                        id="name"
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          // Clear error when user starts typing
                          if (signupError) {
                            resetSignupError();
                          }
                        }}
                        className="input-field pl-12 pr-4 py-3 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    )}
                  />
                </div>
              </motion.div>

              <motion.div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "var(--night)" }}
                >
                  Email address
                </label>
                <div className="relative">
                  <FaEnvelope
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--dim-gray)" }}
                  />
                  <signupForm.Field
                    name="email"
                    children={(field) => (
                      <input
                        id="signup-email"
                        type="email"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          // Clear error when user starts typing
                          if (signupError) {
                            resetSignupError();
                          }
                        }}
                        className="input-field pl-12 pr-4 py-3 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    )}
                  />
                </div>
              </motion.div>

              <motion.div>
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "var(--night)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "var(--dim-gray)" }}
                  />
                  <signupForm.Field
                    name="password"
                    children={(field) => (
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          // Clear error when user starts typing
                          if (signupError) {
                            resetSignupError();
                          }
                        }}
                        className="input-field pl-12 pr-12 py-3 rounded-2xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all duration-200"
                        placeholder="Enter your password"
                      />
                    )}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    style={{ color: "var(--dim-gray)" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Role Selection */}
              <motion.div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "var(--night)" }}>
                  I am a...
                </label>
                <div className="relative bg-gray-100 rounded-2xl p-1">
                  <motion.div
                    className="absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] bg-white rounded-xl shadow-sm"
                    animate={{
                      x: selectedRole === "user" ? 0 : "100%",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <div className="relative flex">
                    <motion.button
                      type="button"
                      onClick={() => handleRoleChange("user")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors duration-200 relative z-10 ${
                        selectedRole === "user" 
                          ? "text-gray-800" 
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaUserFriends className="text-lg" />
                      <span>User</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handleRoleChange("owner")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors duration-200 relative z-10 ${
                        selectedRole === "owner" 
                          ? "text-gray-800" 
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaStore className="text-lg" />
                      <span>Restaurant Owner</span>
                    </motion.button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {selectedRole === "user" 
                    ? "Join as a user to discover and review restaurants" 
                    : "Join as an owner to manage your restaurant listings"
                  }
                </p>
              </motion.div>

              <motion.div>
                <signupForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <motion.button
                      type="submit"
                      className="btn-primary w-full py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={!canSubmit || isSignupPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSignupPending ? "Creating account..." : "Create account"}
                    </motion.button>
                  )}
                />
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AuthPage;
