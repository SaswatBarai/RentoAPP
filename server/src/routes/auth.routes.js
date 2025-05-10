import express from "express";
import passport from "passport";
import {authMiddleware} from "../middlewares/auth-middleware.js"
import{loginValidator,registerValidator} from "../validator/auth-validator.js"

const router = express.Router();



//Routes imports
import {register,loginUser,googleCallback,logout,refreshAccessToken} from "../controllers/user.controller.js"


router.post("/login", loginValidator, loginUser);
router.post("/register", registerValidator, register);
router.get("/get-accessToken",refreshAccessToken);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

// Logout route
router.post("/logout",authMiddleware,logout);

export default router;
