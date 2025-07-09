import mongoose from 'mongoose';

const ivDataSchema = new mongoose.Schema({
  sensorId: String,
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient' 
},
  weight: Number,
  dropCount: Number,
  timestamp: { 
    type: Date, 
    default: Date.now 
}
});

const IVData = mongoose.model('IVData', ivDataSchema);
export default IVData;
