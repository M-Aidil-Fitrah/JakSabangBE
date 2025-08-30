const jwt = require("jsonwebtoken");

exports.checkToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            return res.status(200).json({
                active: true,
                token,
                data: decoded
            });
        }

        return res.status(200).json({
            active: false,
            token,
            data: decoded
        })
    } catch (error) {
        return res.status(200).json({
            active: false,
            token,
            data: decoded
        });
    }
}