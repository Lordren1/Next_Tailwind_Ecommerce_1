import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local"
  );
}

let dbCache = global.mongoose;

if (!dbCache) {
  dbCache = global.mongoose = { conn: null, promise: null };
}

async function dbConnection() {
  // Return existing connection if present
  if(dbCache.conn) {
    return dbCache.conn;
  }

  // Create a new connection if not present
  if (!dbCache.promise) {
   const options = {
    dbName: "swiftcharge", //Change if needed
    bufferCommands: false, // prevent mongoose from buffering commands if not connected
   }

   dbCache.promise = mongoose.connect(MONGO_URI, options).then((mongoose) => {
    console.log("✔ MongoDB connected successfully");
    return mongoose;
   }).catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    throw error;
   });
  }

  //Await the promise and cache the connection object
  dbCache.conn = await dbCache.promise;
  return dbCache.conn;
}

export default dbConnection;