const express = require("express");
const router = express.Router();
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("../swagger/swagger");

router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = router;