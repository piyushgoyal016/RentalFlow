import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import rentalRoutes from "./routes/rental.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import depositRoutes from "./routes/deposit.routes.js";
import returnRoutes from "./routes/return.routes.js";
import lateFeeRoutes from "./routes/lateFee.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────

app.use(cors({
  origin: config.cors.origin,
  credentials: true, // allows cookies / auth headers cross-origin
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Health Check ────────────────────────────────────────────────────────────

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/deposits", depositRoutes);
app.use("/api/v1/returns", returnRoutes);
app.use("/api/v1/late-fees", lateFeeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// ── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Global Error Handler ─────────────────────────────────────────────────────

app.use(errorHandler);

export default app;