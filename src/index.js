import dotenv from "dotenv";
import { app } from "./app.js"; // ✅ Import the app with routes
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" });

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Handle Express errors
    app.on("error", (error) => {
      console.error("Express error:", error);
      throw error;
    });

    // Start listening
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`✅ Server is running at port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();