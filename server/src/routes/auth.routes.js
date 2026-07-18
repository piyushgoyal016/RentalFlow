import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

// ── Public Routes ────────────────────────────────────────────────────────────

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

// ── Protected Routes (Require Authentication) ───────────────────────────────

router.get("/me", requireAuth, authController.getProfile);
router.put("/me", requireAuth, authController.updateProfile);


// ── Protected Role Route Example (Require Admin Role) ────────────────────────

router.get(
  "/admin-dashboard-test",
  requireAuth,
  requireRoles("ADMIN"),
  (req, res) => {
    res.status(200).json(new ApiResponse(200, { secretData: "Enterprise analytics loaded." }, "Welcome Admin"));
  }
);

export default router;
