import express from "express";
import Park from "../models/Park.js";
import { createError } from "../Utils/error.js";

import { countByProvince, countByType, createPark, getPark, getParkSlots, getParksByProvince, getallPark } from "../controllers/park.js";
import { updatePark } from "../controllers/park.js";
import { deletePark } from "../controllers/park.js";
import { verifyAdmin } from "../Utils/verifyToken.js";


const router=express.Router();

//create
router.post("/",verifyAdmin, createPark) ;

//update
router.put("/:id",verifyAdmin, updatePark);

//delete

router.delete("/:id",verifyAdmin, deletePark);
//get

router.get("/find/:id", getPark);
//getall

router.get("/", getallPark);

router.get("/countByProvince", countByProvince);

router.get("/countByType", countByType);

router.get("/byProvince", getParksByProvince)

router.get("/slot/:id", getParkSlots);

export default router