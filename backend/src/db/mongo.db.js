const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is not defined in .env file.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(`${mongoURI}/EVNT_MNG`).catch((err) => {
    // Initial connection error is caught here or by the 'error' event listener
    console.error("Initial connection error to MongoDB:", err.message);
});

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Successfully connected to MongoDB database (EVNT_MNG).");
});

db.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

db.on("disconnected", () => {
    console.warn("Mongoose disconnected from MongoDB database.");
});

// Graceful shutdown
process.on("SIGINT", async () => {
    try {
        await db.close();
        console.log("Mongoose connection closed through app termination.");
        process.exit(0);
    } catch (err) {
        console.error("Error closing Mongoose connection:", err);
        process.exit(1);
    }
});

module.exports = db;