import express from "express";
import passport from "passport";
import {authMiddleware} from "../middlewares/auth-middleware.js"
import{loginValidator,registerValidator} from "../validator/auth-validator.js"

const router = express.Router();

//Routes imports
import {register, loginUser, logout, refreshAccessToken,loginWithGoogle} from "../controllers/user.controller.js"

router.post("/login", loginValidator, loginUser);
router.post("/register", registerValidator, register);
router.get("/get-accessToken",refreshAccessToken);
router.post("/logout", authMiddleware, logout);
router.route("/google")
  .get(loginWithGoogle)

export default router;
