const filesService = require("../services/filesService");

const getFilesInfo = async (req, res) => {
  try {
    const fileInfoArray = await filesService.getFilesInfo();
    res.json(fileInfoArray);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Error" });
  }
};

module.exports = { getFilesInfo };
