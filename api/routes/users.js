
import express from "express";
import { deleteUser, getUser, getallUsers, updateUser } from "../controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin } from "../Utils/verifyToken.js";

const router = express.Router();


// UPDATE USER
router.put("/:id", verifyToken, verifyUser, updateUser);

// DELETE USER
router.delete("/:id", verifyToken, verifyUser, deleteUser);

// GET USER 
router.get("/:id", verifyToken, verifyUser, getUser);

// GET ALL USERS
router.get("/", verifyToken, verifyAdmin, getallUsers);

export default router;