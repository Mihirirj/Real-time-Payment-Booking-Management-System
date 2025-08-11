
import express from "express";
import { createSlot, deleteSlot, getSlot, getallSlots, updateSlot, updateSlotAvailability } from "../controllers/slot.js";
import { verifyAdmin, verifyUser } from "../Utils/verifyToken.js";

const router = express.Router();


router.put("/availability/:id", verifyUser, updateSlotAvailability);

//create
router.post("/:parkid", verifyAdmin, createSlot);

//update
router.put("/:id", verifyAdmin, updateSlot);

//delete
router.delete("/:id/:parkid", verifyAdmin, deleteSlot);

//get
router.get("/:id", getSlot);

//getall
router.get("/", getallSlots);

export default router;