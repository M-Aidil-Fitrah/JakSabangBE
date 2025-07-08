const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const bookingRentalRoutes = require("./routes/bookingRentalRoutes");
const penginapanRoutes = require("./routes/penginapanRoutes");
const bookingPenginapanRoutes = require("./routes/bookingPenginapanRoutes");
const tourGuideRoutes = require("./routes/tourGuideRoutes");
const bookingTourGuideRoutes = require("./routes/bookingTourGuideRoutes");
const bookingPaketRoutes = require("./routes/bookingPaketRoutes");
const paketRoutes = require("./routes/paketRoutes");

const app = express();


// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/booking/rental", bookingRentalRoutes);
app.use("/api/penginapan", penginapanRoutes);
app.use("/api/tourguides", tourGuideRoutes);
app.use("/api/booking/tour-guide", bookingTourGuideRoutes);
app.use("/api/booking/penginapan", bookingPenginapanRoutes);
app.use("/api/booking/paket", bookingPaketRoutes);
app.use("/api/paket", paketRoutes);

// root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });



