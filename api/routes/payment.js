
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import Slot from '../models/Slot.js';

dotenv.config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
    try {
        const { user, park, slotId, slotNumber, checkIn, checkOut } = req.body;

        const slotData = await Slot.findById(slotId);
        if (!slotData) {
            return res.status(404).json({ error: "Slot not found" });
        }
        const pricePerHour = slotData.price;

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const durationInMs = checkOutDate.getTime() - checkInDate.getTime();
        const durationInHours = Math.max(1, Math.ceil(durationInMs / (1000 * 60 * 60)));
        const totalPrice = durationInHours * pricePerHour;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'lkr',
                    product_data: {
                        name: `Parking Slot ${slotNumber} Reservation`,
                        description: `Booking from ${checkInDate.toLocaleString()} to ${checkOutDate.toLocaleString()}`,
                    },
                    unit_amount: totalPrice * 100, // Stripe expects amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            // --- FIX: All date values are now URL-encoded ---
            success_url: `http://localhost:3000/success?slotId=${slotId}&slotNumber=${slotNumber}&parkId=${park}&userId=${user}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&pricePerHour=${pricePerHour}&totalPrice=${totalPrice}&durationHours=${durationInHours}`,
            cancel_url: `http://localhost:3000/cancel`,
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error("Stripe session creation failed:", err);
        res.status(500).json({ error: "Stripe session creation failed" });
    }
});

export default router;