import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import nurseRoutes from './routes/nurseRoutes.js';
import ivDataRoutes from './routes/ivDataRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import serverless from 'serverless-http';

const app = express();
dotenv.config();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/iv-data', ivDataRoutes)
app.use('/api/room', roomRoutes)



module.exports = serverless(app);