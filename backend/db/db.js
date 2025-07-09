import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async() =>{
    try { 
        await mongoose.connect(process.env.MongoDB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected Successfully");
    }
    catch (error){
        console.log("MongoDB connection error: ", error.message);
        process.exit(1);
    }
};

// export default connectDB;