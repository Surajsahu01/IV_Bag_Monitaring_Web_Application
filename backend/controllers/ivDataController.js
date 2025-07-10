import { io } from "../index.js";
import IVData from "../model/IVData.js";
import IVSensor from "../model/IVSensor.js";
import Patient from "../model/Patient.js";
import nodemailer from "nodemailer";




export const receiveSensorData = async (req, res) => {
  try {
    const { sensorId, weight, dropCount } = req.body;

    if (!sensorId || weight === undefined || dropCount === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sensor = await IVSensor.findOne({ sensorId });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not registered' });
    }

    // Find the active patient and the index of the current IV session (bottle)
    const patient = await Patient.findOne({
      isDischarged: false,
      ivBottleHistory: {
        $elemMatch: { ivsensor: sensor._id }
      }
    }).populate('nurse');

    if (!patient) {
      return res.status(404).json({ message: 'No patient linked with this sensor' });
    }

    // Save IV data
    const ivData = await IVData.create({
      patient: patient._id,
      weight,
      dropCount,
      timestamp: new Date()
    });

    // Emit real-time data
    io.emit('iv-Data', {
      patientId: patient._id.toString(),
      patientName: patient.name,
      weight,
      dropCount,
      timestamp: ivData.timestamp
    });

    // 🔍 Find the matching bottle history entry
    const bottleIndex = patient.ivBottleHistory.findIndex(h => h.ivsensor.toString() === sensor._id.toString());

    if (bottleIndex !== -1) {
      const bottle = patient.ivBottleHistory[bottleIndex];

      // ✅ If alert not sent and weight < 50, send alert
      if (!bottle.alertSent && weight < 50 && patient.nurse?.email) {
        await sendNurseEmailAlert({
          nurseEmail: patient.nurse.email,
          patientName: patient.name,
          sensorId: sensorId,
          weight,
          dropCount,
          roomNumber: patient.roomNumber,
          bedNumber: patient.bedNumber
        });

        // 🔒 Mark alert as sent
        patient.ivBottleHistory[bottleIndex].alertSent = true;
        await patient.save();
        console.log(`[Alert] Email sent to ${patient.nurse.email} for ${patient.name}`);
      }
    }

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



const sendNurseEmailAlert = async ({ nurseEmail, patientName, sensorId, weight, dropCount, roomNumber, bedNumber }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"IV Monitoring System" <${process.env.EMAIL_USER}>`,
      to: nurseEmail,
      subject: `⚠️ Low IV Fluid Alert for ${patientName}`,
      html: `
        <h3>🚨 IV Alert</h3>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Sensor ID:</strong> ${sensorId}</p>
        <p><strong>Room:</strong> ${roomNumber || '-'} | <strong>Bed:</strong> ${bedNumber || '-'}</p>
        <p><strong>Current Fluid Weight:</strong> ${weight} ml</p>
        <p><strong>Drop Count:</strong> ${dropCount}</p>
        <p style="color:red;"><strong>⚠ Please check the IV bag immediately.</strong></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] To nurse: ${nurseEmail}`);
  } catch (error) {
    console.error('Email alert failed:', error.message);
  }
};
