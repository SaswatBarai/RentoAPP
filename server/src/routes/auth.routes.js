import express from "express";
import passport from "passport";
import { googleCallback } from "../controllers/user.controller.js";
import { logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: true, failureRedirect: "/login" }),
  googleCallback
);

// Logout route
router.get("/logout", logout);

export default router;
