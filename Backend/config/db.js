import mongoose from "mongoose";

const ConnectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" ✅ Mongodb connect successdfully");
    }catch(err){
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

export default ConnectDB;
