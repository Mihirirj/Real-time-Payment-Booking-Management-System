
import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import { createError } from "../Utils/error.js";


export const createBooking = async (req, res, next) => {
    const { parkId, userId, slotId, slotNumber, checkIn, checkOut, pricePerHour, totalPrice, durationHours } = req.body;
    const reservationId = `RES-${Date.now()}`;
    const newBooking = new Booking({
        park: parkId, user: userId, slot: slotId, slotNumber, checkIn, checkOut, reservationId, pricePerHour, totalPrice, durationHours
    });
    try {
        const savedBooking = await newBooking.save();
        await Slot.updateOne(
            { _id: slotId, "slotNumbers.number": slotNumber },
            { $push: { "slotNumbers.$.unavailableDates": { startDate: checkIn, endDate: checkOut } } }
        );
        res.status(200).json(savedBooking);
    } catch (err) {
        console.error("ERROR in createBooking:", err);
        next(err);
    }
};


export const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).populate('park', 'name').sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};


export const requestCancellation = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return next(createError(404, "Booking not found!"));
        
       
        if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
             return next(createError(403, "You can only request to cancel your own bookings."));
        }
        
        booking.status = 'cancellation-requested';
        await booking.save();
        res.status(200).json({ message: "Cancellation requested. An admin will review it shortly." });
    } catch (err) {
        next(err);
    }
};


export const confirmCancellation = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { $set: { status: 'cancelled' } }, { new: true });
        if (!booking) return next(createError(404, "Booking not found!"));

       
        await Slot.updateOne(
            { _id: booking.slot },
            { $pull: { "slotNumbers.$[].unavailableDates": { startDate: booking.checkIn, endDate: booking.checkOut } } }
        );

        res.status(200).json({ message: "Booking has been cancelled and refunded.", booking });
    } catch (err) {
        next(err);
    }
};


export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate('park', 'name').populate('user', 'username');
        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

export const updateBooking = async (req, res, next) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedBooking);
    } catch (err) {
        next(err);
    }
};

export const deleteBooking = async (req, res, next) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json("Booking has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        res.status(200).json(booking);
    } catch (err) {
        next(err);
    }
};