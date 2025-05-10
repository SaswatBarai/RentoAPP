import express from "express";
import passport from "passport";
import {authMiddleware} from "../middlewares/auth-middleware.js"

const router = express.Router();



//Routes imports
import {register,loginUser,googleCallback,logout,refreshAccessToken} from "../controllers/user.controller.js"



router.post("/login",loginUser);
router.post("/register",register);
router.post("/get-accessToken",refreshAccessToken);

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
router.get("/logout",authMiddleware,logout);

export default router;
