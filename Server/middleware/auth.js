import jwt from "jsonwebtoken"
import User from "../models/User.js";


export const protectRoute = async (req, res, next) => {
    try {
        // FETCH THE TOKEN FROM THE REQUEST HEADER 
        const token = req.headers.token;

        // DEOCDE THE TOKEN AND FETCH THE USERID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // FETCH THE USER DATA USING USER ID 
        const user = await User.findById(decoded.userId).select("-password");

        // IF THE USER IS NOT FOUND IN THE DATABASE THEN RETURN A RESPONSE 
        if (!user) {
            res.json({ success: false, message: "User Not Found." });
        }

        // IF ALL SET THEN ADD THE USER INTO REQUEST AND GO NEXT 
        req.user = user;
        next();

    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}



// CHECK FOR IS THE USER IS AUTHENTICATED 
export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user});
}
