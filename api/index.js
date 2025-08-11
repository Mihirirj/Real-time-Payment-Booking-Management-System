
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";
import parksRoute from "./routes/parks.js";
import slotsRoute from "./routes/slots.js";
import usersRoute from "./routes/users.js";
import bookingsRoute from "./routes/bookings.js";
import paymentRoute from "./routes/payment.js";
import analyticsRoute from "./routes/analytics.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());


app.use("/api/analytics", analyticsRoute); 
app.use("/api/payment", paymentRoute);
app.use("/api/auth", authRoute);
app.use("/api/parks", parksRoute);
app.use("/api/slots", slotsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  });
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});