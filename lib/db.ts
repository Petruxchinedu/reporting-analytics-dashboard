import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in environment variables");
}

const validatedMongoUri: string = MONGODB_URI;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  try {
    if (cached.conn) {
      console.log("Using cached MongoDB connection");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("Creating new MongoDB connection...");
      
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      cached.promise = mongoose.connect(validatedMongoUri, opts).then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:");
    console.error(error);
    throw error;
  }
}

export default connectDB;
