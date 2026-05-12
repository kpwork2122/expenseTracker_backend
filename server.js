import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
//const url = "http://localhost:3000"
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

import cors from "cors"; 
app.use(cors({
origin: "*"
}));


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes)

//app.listen(3000, () => console.log("Server is running on port 3000"))
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

