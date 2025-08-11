
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SlotSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number, // This is the price per hour
        required: true,
    },
    maxVehicle: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    slotNumbers: [{
        number: Number,
        unavailableDates: [{
            startDate: { type: Date },
            endDate: { type: Date }
        }]
    }],
}, { timestamps: true });

export default mongoose.model("Slot", SlotSchema);