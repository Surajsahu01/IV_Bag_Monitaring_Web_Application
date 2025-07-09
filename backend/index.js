import { app } from "./app.js";
import { connectDB } from "./db/db.js";
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import IVData from "./model/IVData.js";
dotenv.config();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']

  }
});


app.use((req, res, next) => {
  req.io = io;
  next();
});

connectDB();


io.on('connection', (socket) => {
  // Handle new socket connection
  const interval = setInterval( async () => {
    try {
      const latestData = await IVData.findOne().sort({ timestamp: -1 }).limit(1).populate('patient');
      if (latestData) {
        socket.emit('latestIVData', {
          patientId: latestData.patient._id.toString(),
          patientName: latestData.patient.name,
          latestData: {
            weight: latestData.weight,
            dropCount: latestData.dropCount,
            timestamp: latestData.timestamp
      }});
      }
    } catch (error) {
      console.error('Error in socket ping:', error);
      clearInterval(interval); // Clear interval on error
      
    }
  }, 2000); // Send ping every 10 seconds
  console.log('New socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

export { io }; // Export the io instance for use in other files

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});