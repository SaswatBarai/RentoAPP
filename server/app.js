import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from "./src/routes/auth.routes.js"
import cors from "cors"
import passport from "passport";
import "./src/configs/passport.js";

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/user", authRoutes);

export  {app};
