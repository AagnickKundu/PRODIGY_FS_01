import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

console.log("Script Started.");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "PRODIGY_FS",
            ssl: true,
            // retryWrites: true,
            // w: "majority",
            // // tlsInsecure: true, // Bypass SSL certificate verification for testing
            // serverSelectionTimeoutMS: 10000
        });
        console.log("MongoDB Connected");
    }
    catch(err) {
        console.error("Mongo error :", err.message);
        console.error("Full error:", err);
        process.exit(1);
    }
};

// Call the function
connectDB();