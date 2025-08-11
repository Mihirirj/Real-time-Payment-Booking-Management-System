
import express from 'express';
import {
    createBooking, updateBooking, deleteBooking, getBooking, getAllBookings, getUserBookings, requestCancellation, confirmCancellation
} from '../controllers/booking.js';
import { verifyAdmin, verifyUser, verifyToken } from '../Utils/verifyToken.js';

const router = express.Router();


router.post("/", createBooking); 
router.get("/user/:userId", verifyToken, verifyUser, getUserBookings); 


router.put("/request-cancellation/:id", verifyToken, requestCancellation);


router.get("/", verifyToken, verifyAdmin, getAllBookings);
router.put("/confirm-cancellation/:id", verifyToken, verifyAdmin, confirmCancellation);

router.put("/:id", verifyToken, verifyUser, updateBooking);
router.delete("/:id", verifyToken, verifyUser, deleteBooking);
router.get("/find/:id", getBooking);

export default router;