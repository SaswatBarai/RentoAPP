import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from "./src/routes/auth.routes.js"
import cors from "cors"
import "./src/configs/passport.js";

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use("/user", authRoutes);

export  {app};
