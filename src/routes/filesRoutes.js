const express = require("express");
const filesController = require("../controllers/filesController");

const router = express.Router();

router.get("/data", filesController.getFilesInfo);
router.get("/data/detail", filesController.getFileByQueryparam);

module.exports = router;
