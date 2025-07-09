import mongoose from "mongoose";

const BedSchema = new mongoose.Schema({
    bedNumber: {
        type: String,
        required: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
    }
});

const RoomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    beds: [BedSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Room = mongoose.model('Room', RoomSchema);
export default Room;