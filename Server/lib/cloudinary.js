import {v2 as cloudinary} from "cloudinary"
import { protectRoute } from "../middleware/auth.js"


cloudinary.config({
    cloud_name:process.env.CLOUDE_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})


export default cloudinary;