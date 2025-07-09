import { io } from "../index.js";
import IVData from "../model/IVData.js";
import IVSensor from "../model/IVSensor.js";
import Patient from "../model/Patient.js";


// export const receiveSensorData = async (req, res) => {
//   try {
//     const { sensorId, weight, dropCount } = req.body;

//     if (!sensorId || weight === undefined || dropCount === undefined) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Find patient using this sensor
//     const patient = await Patient.findOne({ ivsensor: sensorId });

//     if (!patient) {
//       return res.status(404).json({ message: 'No patient linked with this sensor' });
//     }

//     // Save data
//     const ivData = await IVData.create({
//       patient: patient._id,
//       weight,
//       dropCount,
//       timestamp: new Date()
//     });

//     // Emit live update via socket
//     if (req.io) {
//       req.io.emit('iv-data', {
//         patientId: patient._id,
//         patientName: patient.name,
//         weight,
//         dropCount,
//         timestamp: ivData.timestamp
//       });
//     }

//     res.status(201).json({ message: 'Data saved', data: ivData });
//   } catch (error) {
//     console.error('receiveSensorData Error:', error);
//     res.status(500).json({ message: 'Server error saving IV data' });
//   }
// };


export const receiveSensorData = async (req, res) => {
  try {
    const { sensorId, weight, dropCount } = req.body;

    if (!sensorId || weight === undefined || dropCount === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Step 1: Find IVSensor by sensorId
    const sensor = await IVSensor.findOne({ sensorId });

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not registered' });
    }

    // Step 2: Find patient linked to this sensor
    const patient = await Patient.findOne({isDischarged: false, ivBottleHistory: { $elemMatch: { ivsensor: sensor._id } } });

    if (!patient) {
      return res.status(404).json({ message: 'No patient linked with this sensor' });
    }

    // Step 3: Save IV data
    const ivData = await IVData.create({
      patient: patient._id,
      weight,
      dropCount,
      timestamp: new Date()
    });

    // Step 4: Emit real-time update via socket.io (optional)
    // if (req.io) {
    //   console.log('📡 Emitting iv-Data to socket clients...');
    //   req.io.emit('iv-Data', {
    //     patientId: patient._id.toString(),
    //     patientName: patient.name,
    //     weight,
    //     dropCount,
    //     timestamp: ivData.timestamp
    //   });
    // }

    // Emit real-time update via socket.io
    io.emit('iv-Data', {
      patientId: patient._id.toString(),
      patientName: patient.name,
      weight,
      dropCount,
      timestamp: ivData.timestamp
    });

    
    res.status(201).json({ message: 'Data saved', data: ivData });

  } catch (error) {
    console.error('receiveSensorData Error:', error);
    res.status(500).json({ message: 'Server error saving IV data' });
  }
};


export const getPatientIVHistory = async (req, res) => {
  try {
    const patientId = req.params.id;

    const history = await IVData.find({ patient: patientId }).sort({ timestamp: -1 });

    res.json(history);
  } catch (error) {
    console.error('getPatientIVHistory Error:', error);
    res.status(500).json({ message: 'Server error fetching IV data history' });
  }
};


export const getLatestIVData = async (req, res) => {
  try {
    const patientId = req.params.id;

    const latest = await IVData.findOne({ patient: patientId }).sort({ timestamp: -1 });

    if (!latest) {
      return res.status(404).json({ message: 'No IV data found for this patient' });
    }

    res.json(latest);
  } catch (error) {
    console.error('getLatestIVData Error:', error);
    res.status(500).json({ message: 'Server error fetching latest IV data' });
  }
};


export const getAllLatestIVData = async (req, res) => {
  try {
    const patients = await Patient.find().select('_id name');

    const data = await Promise.all(
      patients.map(async (p) => {
        const latest = await IVData.findOne({ patient: p._id }).sort({ timestamp: -1 });
        return {
          patientId: p._id,
          patientName: p.name,
          latestData: latest || null
        };
      })
    );

    res.json(data);
  } catch (error) {
    console.error('getAllLatestIVData Error:', error);
    res.status(500).json({ message: 'Server error fetching latest data' });
  }
};