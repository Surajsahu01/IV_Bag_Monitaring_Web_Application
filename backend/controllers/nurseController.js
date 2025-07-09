import IVData from "../model/IVData.js";
import IVSensor from "../model/IVSensor.js";
import Patient from "../model/Patient.js";
import Room from "../model/Room.js";


// export const addPatient = async (req, res) => {
//   try {
//     const { name, age, gender, ivSensorId, roomNumber, bedNumber, mobile, note } = req.body;

//     if (!name || !age || !gender || !ivSensorId || !roomNumber || !bedNumber || !mobile) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Find sensor and check if it is available
//     const sensor = await IVSensor.findOne({ sensorId: ivSensorId, assigned: false });
//     if (!sensor) {
//       return res.status(404).json({ message: 'Sensor not found or already assigned' });
//     }

//     // Find room and bed
//     const room = await Room.findOne({ roomNumber });
//     if (!room) return res.status(404).json({ message: 'Room not found' });

//     const bed = room.beds.find(b => b.bedNumber === bedNumber);
//     if (!bed) return res.status(404).json({ message: 'Bed not found' });

//     let patient = await Patient.findOne({ mobile });

//     if (patient) {


//       if (patient.isDischarged) {
//       // Check if bed is available
//       if (bed.isOccupied) {
//         return res.status(400).json({ message: 'Bed is already occupied' });
//       }

//       // Update patient admission info
//       patient.isDischarged = false;
//       patient.roomNumber = roomNumber;
//       patient.bedNumber = bedNumber;
//       patient.dischargeDetails = null;

//       // Update bed status
//       bed.isOccupied = true;
//       bed.patient = patient._id;
//       await room.save();
//     }
//       // Patient already exists — add new IV bottle
//       patient.ivBottleHistory.push({
//         ivsensor: sensor._id,
//         // count: 1,
//         nurse: req.user.id,
//         note
//       });

//       patient.iVBottleCount += 1;
//       await patient.save();

//       // Mark sensor as assigned
//       sensor.assigned = true;
//       sensor.patient = patient._id;
//       await sensor.save();

//       return res.status(200).json({
//         message: patient.isDischarged
//       ? 'Patient readmitted and new IV bottle added'
//       : 'New IV bottle added to existing patient',
//         patient
//       });
//     }

//     // Check if bed is occupied
//     if (bed.isOccupied) {
//       return res.status(400).json({ message: 'Bed is already occupied' });
//     }

//     // Create new patient with one IV bottle
//     patient = await Patient.create({
//       name,
//       mobile,
//       age,
//       gender,
//       nurse: req.user.id,
//       roomNumber,
//       bedNumber,
//       iVBottleCount: 1,
//       ivBottleHistory: [{
//         ivsensor: sensor._id,
//         count: 1,
//         nurse: req.user.id,
//         note
//       }]
//     });

//     // Assign sensor
//     sensor.assigned = true;
//     sensor.patient = patient._id;
//     await sensor.save();

//     // Mark bed as occupied
//     bed.isOccupied = true;
//     bed.patient = patient._id;
//     await room.save();

//     return res.status(201).json({
//       message: 'Patient registered and IV bottle added',
//       patient
//     });

//   } catch (error) {
//     console.error('Add Patient Error:', error);
//     res.status(500).json({ message: 'Server error while adding patient' });
//   }
// };
export const addNewPatient = async (req, res) => {
  try {
    const { name, age, gender, ivSensorId, roomNumber, bedNumber, mobile, note } = req.body;

    if (!name || !age || !gender || !ivSensorId || !roomNumber || !bedNumber || !mobile) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingPatient = await Patient.findOne({ mobile });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists. Use existing patient route.' });
    }

    const sensor = await IVSensor.findOne({ sensorId: ivSensorId, assigned: false });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found or already assigned' });
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const bed = room.beds.find(b => b.bedNumber === bedNumber);
    if (!bed || bed.isOccupied) return res.status(400).json({ message: 'Bed is not available' });

    const patient = await Patient.create({
      name,
      mobile,
      age,
      gender,
      nurse: req.user.id,
      roomNumber,
      bedNumber,
      iVBottleCount: 1,
      ivBottleHistory: [{
        ivsensor: sensor._id,
        count: 1,
        nurse: req.user.id,
        note
      }]
    });

    sensor.assigned = true;
    sensor.patient = patient._id;
    await sensor.save();

    bed.isOccupied = true;
    bed.patient = patient._id;
    await room.save();

    const populatedPatient = await patient.populate('ivBottleHistory.nurse', 'name');

    return res.status(201).json({
      message: 'Patient registered and IV bottle added',
      patient: populatedPatient
    });

  } catch (error) {
    console.error('Add New Patient Error:', error);
    res.status(500).json({ message: 'Server error while adding patient' });
  }
};


export const addExistingPatientIVBottle = async (req, res) => {
  try {
    const { mobile, ivSensorId, roomNumber, bedNumber, note } = req.body;

    if (!mobile || !ivSensorId || !roomNumber || !bedNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const patient = await Patient.findOne({ mobile });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const sensor = await IVSensor.findOne({ sensorId: ivSensorId, assigned: false });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found or already assigned' });
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const bed = room.beds.find(b => b.bedNumber === bedNumber);
    if (!bed || bed.isOccupied) return res.status(400).json({ message: 'Bed is not available' });

    if (patient.isDischarged) {
      // Readmit patient
      patient.isDischarged = false;
      patient.roomNumber = roomNumber;
      patient.bedNumber = bedNumber;
      patient.dischargeDetails = null;

      bed.isOccupied = true;
      bed.patient = patient._id;
      await room.save();
    } else {
      return res.status(400).json({ message: 'Patient already admitted' });
    }

    patient.nurse = req.user.id;

    patient.ivBottleHistory.push({
      ivsensor: sensor._id,
      nurse: req.user.id,
      note
    });
    patient.iVBottleCount += 1;
    await patient.save();

    sensor.assigned = true;
    sensor.patient = patient._id;
    await sensor.save();

    const populatedPatient = await patient.populate('ivBottleHistory.nurse', 'name');

    return res.status(200).json({
      message: 'IV bottle added to existing patient',
      patient: populatedPatient
    });

  } catch (error) {
    console.error('Add Existing Patient IV Bottle Error:', error);
    res.status(500).json({ message: 'Server error while adding IV bottle' });
  }
};

export const dischargePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (req.user.role === 'nurse' && patient.nurse.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    // Get latest IV bottle sensor ID
    const latestBottle = patient.ivBottleHistory[patient.ivBottleHistory.length - 1];
    const ivSensorId = latestBottle?.ivsensor;

    // Unassign IV sensor if found
    if (ivSensorId) {
      await IVSensor.findByIdAndUpdate(ivSensorId, {
        assigned: false,
        patient: null
      });
    }

    // Unassign room and bed if applicable
    if (patient.roomNumber && patient.bedNumber) {
      const room = await Room.findOne({ roomNumber: patient.roomNumber });
      if (room) {
        const bed = room.beds.find(b => b.bedNumber === patient.bedNumber);
        if (bed) {
          bed.isOccupied = false;
          bed.patient = null;
          await room.save();
        }
      }
    }

    // Update patient fields safely using update operation
    await Patient.findByIdAndUpdate(patientId, {
      isDischarged: true,
      dischargeDetails: {
        ivSensorId: ivSensorId ? ivSensorId.toString() : null,
        roomNumber: patient.roomNumber,
        bedNumber: patient.bedNumber,
        dischargeDate: new Date()
      },
      roomNumber: null,
      bedNumber: null
    });

    res.status(200).json({ message: 'Patient discharged successfully' });

  } catch (error) {
    console.error('Discharge Patient Error:', error);
    res.status(500).json({ message: 'Server error while discharging patient' });
  }
};

export const getMyPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ nurse: req.user.id })
      // .populate('ivBottleHistory.ivsensor', 'sensorId')
      .populate('nurse', 'name')
      // .select('name age gender mobile roomNumber bedNumber iVBottleCount ivBottleHistory dischargeDetails isDischarged');
      .select('name age gender mobile roomNumber bedNumber isDischarged dischargeDetails');

    res.json(patients);
  } catch (error) {
    console.error('Get My Patients Error:', error);
    res.status(500).json({ message: 'Server error while fetching patients' });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Check patient ownership
    const patient = await Patient.findOne({ _id: patientId, nurse: req.user.id })
      .populate('ivBottleHistory.ivsensor', 'sensorId')
      .populate('nurse', 'name')
      .select('name age gender mobile roomNumber bedNumber iVBottleCount ivBottleHistory dischargeDetails isDischarged');

    if (!patient) {
      return res.status(403).json({ message: 'Access denied to patient history' });
    }

    // Get IV data
    const history = await IVData.find({ patient: patientId }).sort({ timestamp: -1 });

    // res.json(history, {
    //   message: 'Patient history fetched successfully',
    //   patientName: patient.name  
    // });

    res.json({
      message: 'Patient history fetched successfully',
      patient,
      history
    });
  } catch (error) {
    console.error('Get Patient History Error:', error);
    res.status(500).json({ message: 'Server error while fetching history' });
  }
};

export const getLiveDataForNurse = async (req, res) => {
  try {
    const patients = await Patient.find({ nurse: req.user.id, isDischarged: false }).select('_id name');

    const data = await Promise.all(
      patients.map(async (p) => {
        const latest = await IVData.findOne({ patient: p._id }).sort({ timestamp: -1 });
        return {
          patientId: p._id,
          patientName: p.name,
          latestData: latest || {}
        };
      })
    );

    res.json(data);
  } catch (error) {
    console.error('Get Live Data Error:', error);
    res.status(500).json({ message: 'Server error fetching live IV data' });
  }
};


export const getAvailableSenore = async (req, res) => {
  try {
    const sensore = await IVSensor.find({ assigned: false }).select('sensorId');
    res.status(200).json({sensore});
  } catch (error) {
    console.error('Get Available Sensors Error:', error);
    res.status(500).json({ message: 'Server error while fetching available sensors' });    
  }
}





