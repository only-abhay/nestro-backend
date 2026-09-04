import mongoose from "mongoose";

async function ConnectDb() {
  try {
    await mongoose.connect(process.env.MONGO_DB_CATEGORY);

    console.log("✅ Database Connected");
  } catch (error) {
    console.log("❌ Database Connection Error:");
    console.log(error.message);
  }
}

export default ConnectDb;