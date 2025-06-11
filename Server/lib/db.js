import mongoose from "mongoose"
import "dotenv/config"

export const db=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("DATABASE CONNECTED")})
    .catch((err)=>{
        console.log("Not Able To Connect With Database : ",err);
        process.exit(1);
    })
}