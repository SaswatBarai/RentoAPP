import dotenv from 'dotenv';
dotenv.config();
import {app} from "./app.js";
import connectDB from "./src/configs/db.js"



const port = process.env.PORT || 5000;
try {
    let res = await connectDB(process.env.MONGO_URI);
    if (res) {
        console.log("MongoDB connected successfully")
    }
    app.listen(port, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
} catch (error) {
    console.log("Error connecting to MongoDB", error.message);
    process.exit(1);
}