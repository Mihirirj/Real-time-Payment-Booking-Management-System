
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BookingSchema = new Schema({
    park: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Park',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
    },
    reservationId: {
        type: String,
        required: true,
        unique: true,
    },
    slotNumber: {
        type: Number,
        required: true,
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    durationHours: {
        type: Number,
        required: true,
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed', 'cancellation-requested'],
        default: 'booked'
    },
}, { timestamps: true });


export default mongoose.model('Booking', BookingSchema);