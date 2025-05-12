import mongoose from "mongoose";

const connectDB = async ()=>{
    try{

        const cnt = await mongoose.connect(process.env.MONGO_URI);
        console.log(cnt.connection.host+" connected to MongoDB");        
    } 
    catch(error){
        console.error("MONGO DB NOT CONNECTED: "+error);
        process.exit(1);
    }
}

export default connectDB;
 