import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connection = ()=>{
    mongoose.connect(process.env.MONGODB_URL,)
    .then(()=> console.log('Connected to the database is established successfully'))
    .catch((error) => console.log(`${error} did not connect`))
}

export default  connection