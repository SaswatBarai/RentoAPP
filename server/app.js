import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from "./src/routes/auth.routes.js"

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use("api/auth/user",authRoutes);

export  {app};
