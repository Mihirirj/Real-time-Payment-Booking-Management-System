
import express from 'express';
import Booking from '../models/Booking.js';
import { verifyToken, verifyAdmin } from '../Utils/verifyToken.js';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';

const router = express.Router();


router.get("/revenue", verifyToken, verifyAdmin, async (req, res, next) => {
    const { period } = req.query; // Expects 'daily', 'weekly', or 'monthly'
    const now = new Date();
    let startDate;

    switch (period) {
        case 'weekly':
            // Start of the current week (assuming Monday is the first day)
            startDate = startOfWeek(now, { weekStartsOn: 1 });
            break;
        case 'monthly':
            // Start of the current month
            startDate = startOfMonth(now);
            break;
        default: // 'daily'
            // The last 7 days including today
            startDate = subDays(now, 6);
    }

    try {
        const data = await Booking.aggregate([
            // Find bookings created within the time period that are not cancelled
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            {
                // Group them by the date they were created
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            // Sort by date ascending
            { $sort: { _id: 1 } }
        ]);
        
      
        const formattedData = data.map(item => ({
            date: format(new Date(item._id), 'MMM d'), 
            revenue: item.revenue
        }));

        res.status(200).json(formattedData);
    } catch (err) {
        next(err);
    }
});

export default router;