import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {connectDB} from './lib/db.js';

import authRoutes from './routes/authRoute.js';
import messageRoutes from './routes/messageRoute.js';


dotenv.config();
const app= express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL||"http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes);

app.listen(PORT, () =>{
    console.log("Server is running on port", PORT);
    connectDB();
});
