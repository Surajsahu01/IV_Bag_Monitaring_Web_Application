import IVData from "../model/IVData.js";
import IVSensor from "../model/IVSensor.js";
import Patient from "../model/Patient.js";
import Room from "../model/Room.js";
import User from "../model/User.js";

export const addsensor = async (req, res) => {
    try {
    const { sensorId } = req.body;

    if (!sensorId) {
      return res.status(400).json({ message: 'Sensor ID is required' });
    }

    // Check if sensor already exists
    const exists = await IVSensor.findOne({ sensorId });
    if (exists) {
      return res.status(409).json({ message: 'Sensor already exists' });
    }

    const sensor = await IVSensor.create({ sensorId });

    res.status(201).json({
      message: 'Sensor added successfully',
      sensor
    });
  } catch (error) {
    console.error('Add Sensor Error:', error);
    res.status(500).json({ message: 'Server error while adding sensor' });
  }
};

export const getNurses = async (req, res) => {
    try {
        const nurses = await User.find({ role: 'nurse' }).select('-password');
        if (nurses.length === 0) {
            return res.status(404).json({ message: 'No nurses found' });
        }
        res.status(200).json({ nurses });
    } catch (error) {
        console.error('Get Nurses Error:', error);
        res.status(500).json({ message: 'Server error while fetching nurses' });     
    }
};


export const getPatients = async (req, res) => {
    try{
        const patient = await Patient.find()
        .populate('nurse', 'name email')
        // .populate('ivBottleHistory.ivsensor', 'sensorId')
        .select('name age gender mobile roomNumber bedNumber isDischarged');
        if (patient.length === 0) {
            return res.status(404).json({ message: 'No patients found' });
        }

        res.status(200).json({ patient });

    }
    catch (error) {
        console.error('Get Patients Error:', error);
        res.status(500).json({ message: 'Server error while fetching patients' });
    }
};

export const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Check patient ownership
    const patient = await Patient.findOne({ _id: patientId })
      .populate('ivBottleHistory.ivsensor', 'sensorId')
      .populate('nurse', 'name email')
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


export const getAllSensors = async (req, res) => {
    try {
        const sensors = await IVSensor.find().populate('patient', 'name');
        res.json(sensors);
  } catch (error) {
        console.error('Get Sensors Error:', error);
        res.status(500).json({ message: 'Server error while fetching sensors' });
  }
};


export const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;

    const sensor = await IVSensor.findById(id);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    // Prevent deletion if sensor is assigned
    if (sensor.assigned) {
      return res.status(400).json({ message: 'Cannot delete assigned sensor' });
    }

    await sensor.deleteOne();
    res.json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    console.error('Delete Sensor Error:', error);
    res.status(500).json({ message: 'Server error while deleting sensor' });
  }
};


export const getAllPatientHistories = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('nurse', 'name email')
      .populate('ivBottleHistory.ivsensor', 'sensorId');

    // For each patient, get their IV data history
    const results = await Promise.all(patients.map(async (patient) => {
      const ivHistory = await IVData.find({ patient: patient._id }).sort({ timestamp: -1 });

      return {
        patient,
        history: ivHistory
      };
    }));

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching patient histories:', error);
    res.status(500).json({ message: 'Server error while fetching histories' });
  }
};


export const createRoom = async (req, res) => {
  try {
    const { roomNumber, beds } = req.body;
    if (!roomNumber || !beds || !Array.isArray(beds) || beds.length === 0) {
      return res.status(400).json({ message: 'Room number and beds are required' });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({roomNumber});
    
    if (existingRoom) {
      return res.status(409).json({ message: 'Room already exists' });
    }

    const newRoom = await Room.create({
      roomNumber,
      beds: beds.map(b => ({
        bedNumber: b.bedNumber,
        isOccupied: b.isOccupied || false,
        patient: b.patient || null
      })),
      isActive: true
    });

    res.status(201).json({
      message: 'Room created successfully',
      room: newRoom
    });
  } catch (error) {
    console.error('Create Room Error:', error);
    res.status(500).json({ message: 'Server error while creating room' });
    
  }
}

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('beds.patient', 'name age gender');
    res.status(200).json({ rooms });
  } catch (error) {
    console.error('Get Rooms Error:', error);
    res.status(500).json({ message: 'Server error while fetching rooms' });
  }
};

export const addBedToRoom = async (req, res) => {
  try {
    const { roomNumber, bedNumber } = req.body;

    if (!roomNumber || !bedNumber) {
      return res.status(400).json({ message: 'Room number and bed number are required' });
    }

    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const existingBed = room.beds.find((bed) => bed.bedNumber === bedNumber);

    if (existingBed) {
      return res.status(409).json({ message: 'Bed with this number already exists in this room' });
    }

    room.beds.push({
      bedNumber,
      isOccupied: false,
      patient: null
    });

    await room.save();

    res.status(200).json({ message: 'Bed added successfully', room });
  } catch (error) {
    console.error('Error adding bed:', error);
    res.status(500).json({ message: 'Server error while adding bed to room' });
  }
};

// export const getAvailableRoomsForNurse = async (req, res) => {
//   try {
//     const rooms = await Room.find({ isActive: true })

//     const filteredRooms = rooms.map(room => {
//       const availableBeds = room.beds.filter(bed => !bed.isOccupied);
//       return { 
//         _id: room._id,
//         roomNumber: room.roomNumber,
//         beds: availableBeds
//        };
//     }).filter(room => room.beds.length > 0);
    
//     res.status(200).json({ rooms: filteredRooms });
//   } catch (error) {
//     console.error('Get Available Rooms Error:', error);
//     res.status(500).json({ message: 'Server error while fetching available rooms' });
//   } 

// };

export const getAvailableRoomsForNurse = async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true });

    const availableRoomNumbers = rooms
      .filter(room => room.beds.some(bed => !bed.isOccupied))
      .map(room => ({
        _id: room._id,
        roomNumber: room.roomNumber
      }));

    res.status(200).json({ rooms: availableRoomNumbers });
  } catch (error) {
    console.error('Get Available Room Numbers Error:', error);
    res.status(500).json({ message: 'Server error while fetching available room numbers' });
  }
};

// DELETE a bed from a room
// export const deleteBedFromRoom = async (req, res) => {
//   try {
//     const { roomNumber, bedNumber } = req.body;

//     if (!roomNumber || !bedNumber) {
//       return res.status(400).json({ message: 'Room number and bed number are required' });
//     }

//     const room = await Room.findOne({ roomNumber });

//     if (!room) {
//       return res.status(404).json({ message: 'Room not found' });
//     }

//     const bedIndex = room.beds.findIndex(bed => bed.bedNumber === bedNumber);

//     if (bedIndex === -1) {
//       return res.status(404).json({ message: 'Bed not found in this room' });
//     }

//     const isOccupied = room.beds[bedIndex].isOccupied;
//     if (isOccupied) {
//       return res.status(400).json({ message: 'Cannot delete an occupied bed' });
//     }

//     room.beds.splice(bedIndex, 1);
//     await room.save();

//     res.status(200).json({ message: `Bed ${bedNumber} deleted from room ${roomNumber}` });
//   } catch (error) {
//     console.error('Delete Bed Error:', error);
//     res.status(500).json({ message: 'Server error while deleting bed' });
//   }
// };

export const getAvailableBedsByRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const room = await Room.findOne({ roomNumber: roomNumber, isActive: true });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or inactive' });
    }

    const availableBeds = room.beds.filter(bed => !bed.isOccupied);

    res.status(200).json({ beds: availableBeds });

  } catch (error) {
    console.error('Get Available Beds Error:', error);
    res.status(500).json({ message: 'Server error while fetching available beds' });
  }
};

export const getAdminDashboardData = async (req, res) => {
  try {
    const totalNurses = await User.countDocuments({ role: 'nurse' });
    const totalPatients = await Patient.countDocuments({ isDischarged: false });
    const totalSensors = await IVSensor.countDocuments({ assigned: false });
    const totalRooms = await Room.countDocuments({ isActive: true });

    const allRooms = await Room.find({}, 'beds');
    // const totalBeds = allRooms.reduce((acc, room) => acc + room.beds.length, 0);
    const totalBeds = allRooms.reduce((acc, room) => acc + room.beds.filter(bed => !bed.isOccupied).length, 0);

    res.json({
      totalNurses,
      totalPatients,
      totalSensors,
      totalRooms,
      totalBeds
    });
  } catch (error) {
    console.error('Get Admin Dashboard Data Error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
};