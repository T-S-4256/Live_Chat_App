import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";
console.log("Message Routes")
const messageRouter=express.Router();
messageRouter.get("/users",protectRoute,getUsersForSidebar);
messageRouter.get("/mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);
messageRouter.get("/:id",protectRoute,getMessages);



export default messageRouter;