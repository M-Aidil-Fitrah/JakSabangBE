const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
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
const verifikasiSellerRoutes = require("./routes/verifikasiSellerRoutes");
const app = express();
const passport = require("passport");
require("./config/passport"); 
const utilsRoutes = require('./routes/utilsRoutes');


// middleware
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use("/api/verifikasi", verifikasiSellerRoutes); 
app.use('/api', utilsRoutes);


app.use(passport.initialize());
// root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});


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



