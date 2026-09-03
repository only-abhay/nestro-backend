import mongoose from "mongoose"

  async function  ConnectDb(){
    try {
 await mongoose.connect(process.env.MONGO_DB_CATEGORY)
    } catch (error) {
        console.log(error)
    }
}
export default ConnectDb
