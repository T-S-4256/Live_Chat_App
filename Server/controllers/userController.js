import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js"
import bcrypt from "bcrypt"



// SIGN UP CONSTROLLER 
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        // CHECK IS ALL THE DATA HAVE CAME OR NOT 
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // CHECK THE EMAIL IS ALREADY EXIST OR NOT 
        const user = await User.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "Account Already Exist.." })
        }

        // GENERATE THE ENCRYPTED PASSWORD 

        // CREATE THE SALT 
        const salt = await  bcrypt.genSalt(10);

        // CREATE THE HASHE PASSWORD 
        const hashedPassword = await bcrypt.hash(password, salt);

        // CREATE A NEW USER 
        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        })

        // GENERATE THE TOKEN  FUNTION IS IN THE LIB.UTILS.JS 
        const token = generateToken(newUser._id);

        // RETURN THE SUCCESS RESPONSE 
        res.json({ success: true, userData: newUser, token, message: "Account Created Successfully" });
    }
    catch (error) {
        console.log("Error Occured : ", error.message);
        res.json({ success: false, message: error.message });
    }
}


// LOGIN CONTROLLER 
export const login = async (req, res) => {
    try {

        // FETCH THE EMAIL AND PASSWORD FROM THE REQUEST BODY 
        const { email, password } = req.body;

        // CHECK IS THE EMAIL EXIST OR NOT 
        const userData = await User.findOne({ email })

        // IF EMAIL NOT EXIST THEN RETURN RESPONSE 
        if (!userData) {
            res.json({ success: false, message: "Invalid Email Id" })
        }

        // CHECK IS THE PASSWORD BELONGS TO THAT EMAIL OR NOT 
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        // IF THE PASSWORD IS INCORRECT 
        if (!isPasswordCorrect) {
            res.json({ success: false, message: "Invalid Password" })
        }

        // GENERATE THE TOKEN  FUNTION IS IN THE LIB.UTILS.JS 
        const token = generateToken(userData._id);

        // RETURN THE SUCCESS RESPONSE 
        res.json({ success: true, userData, token, message: "Login Successfully" });
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// CONTROLLER TO UPDATE USER PROFILE 
export const updateProfile=async (req,res)=>{
    try{
        const {profilePic,bio,fullName}=req.body;
        const userId=req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
        }

res.json({success:true,user:updatedUser,message :"Profile Updated Successfully"});
    }
    catch(error){
        console.log("Error : ",error.message)
        res.json({success:false,message:error.message});
    }
}