import mongoose from "mongoose";


const ivBottleHistorySchema = new mongoose.Schema(
  {
    ivsensor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IVSensor',
      required: true
    },
    // count: {
    //   type: Number,
    //   default: 1
    // },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: String,
      default: ''
    }
  },
  {
    _id: false 
  }
);

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // ivsensor: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'IVSensor',     
    //   required: false,
    //   default: null       
    // },
    iVBottleCount: {
      type: Number,
      default: 0
    },
    ivBottleHistory: {
      type: [ivBottleHistorySchema],
      default: []
    },
    roomNumber: {
      type: Number,
      // required: false,
      default: null
    },
    bedNumber: {
      type: String,
      // required: false,
      default: ''
    },
    isDischarged: {
      type: Boolean,
      default: false
    },
    dischargeDetails: {
      ivSensorId: {
        type: String,
      },
      roomNumber: {
        type: Number
      },
      bedNumber: {
        type: String
      },
      dischargeDate: {
        type: Date
      }
    }
  },
  {
    timestamps: true
  }
);

const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);
export default Patient;
