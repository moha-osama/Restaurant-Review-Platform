import express from "express";
import userRouter from "./routes/user.router.js";
import restaurantRouter from "./routes/restaurants.router.js";
import reviewRouter from "./routes/review.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // ← Change this from "*" to specific URL
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Set-Cookie",
      "Access-Control-Allow-Credentials",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());

app.use("/users", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/restaurants", reviewRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant Review Platform!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
