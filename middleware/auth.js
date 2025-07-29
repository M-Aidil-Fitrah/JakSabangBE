const jwt = require("jsonwebtoken");

// ✅ Middleware cek token biasa
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token tidak valid" });
  }
};

// ✅ Middleware cek kalau user adalah admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Hanya admin yang diizinkan" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
