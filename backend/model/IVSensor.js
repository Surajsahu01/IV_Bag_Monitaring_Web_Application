import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  sensorId: { 
    type: String, 
    unique: true 
},
  assigned: { 
    type: Boolean, 
    default: false 
},
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    default: null 
}
});

const IVSensor = mongoose.model('IVSensor', sensorSchema);
export default IVSensor;

