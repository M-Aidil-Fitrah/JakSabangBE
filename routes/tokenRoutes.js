const express = require("express");
const { checkToken } = require("../controllers/tokenController");

const router = express.Router();

router.get("/", checkToken);

module.exports = router;