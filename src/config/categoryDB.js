import mongoose from "mongoose"

async function ConnectDb() {
  await mongoose.connect(process.env.MONGO_DB_CATEGORY, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  console.log("Database connected");
}

export default ConnectDb
