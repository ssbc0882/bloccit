const express = require("express");
const router = express.Router();

const rulesController = require("../controllers/rulesController");

router.get("/rules", rulesController.index);

module.exports = router;