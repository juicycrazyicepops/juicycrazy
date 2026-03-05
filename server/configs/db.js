import mongoose from "mongoose";

const connectDB = async () => {
  try {
    
    mongoose.connection.on("connected", () => console.log("Database Connected"));

    
    await mongoose.connect(process.env.MONGODB_URI, {
      w: "majority", 
      
    });

    console.log("MongoDB connection successful!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;