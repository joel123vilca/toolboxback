const axios = require("axios");
const csvUtils = require("../utils/csvUtils");

const API_URL = "https://echo-serv.tbxnet.com/v1/secret";
const API_KEY = "aSuperSecretKey";

const getFilesInfo = async () => {
  try {
    const fileListResponse = await axios.get(`${API_URL}/files`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const files =
      fileListResponse.data && fileListResponse.data.files
        ? fileListResponse.data.files
        : [];

    const fileInfoPromises = files.map(async (fileName) => {
      try {
        const fileResponse = await axios.get(`${API_URL}/file/${fileName}`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        const lines = await formatCsvLines(fileResponse.data);

        return {
          file: fileName,
          lines: lines,
        };
      } catch (error) {
        console.error(`Error  ${fileName}:`, error.message);
        return {
          file: fileName,
          lines: [],
          error: `Error in download: ${error.message}`,
        };
      }
    });

    const fileInfoArray = await Promise.all(fileInfoPromises);
    const validFileInfo = fileInfoArray.filter(
      (info) => info && !info.error && info.lines.length > 0
    );
    return validFileInfo;
  } catch (error) {
    return [];
  }
};

const formatCsvLines = async (csvData) => {
  const jsonArray = await csvUtils.fromString(csvData);
  const validLines = jsonArray.filter((line) => isValidLine(line));

  return validLines.map((line) => ({
    text: line.text,
    number: parseInt(line.number, 10),
    hex: line.hex,
  }));
};

const isValidLine = (line) => {
  return (
    line &&
    line.file !== undefined &&
    line.text !== undefined &&
    line.number !== undefined &&
    line.hex !== undefined &&
    typeof line.text === "string" &&
    !isNaN(line.number) &&
    typeof line.hex === "string" &&
    /^[0-9a-fA-F]{32}$/.test(line.hex)
  );
};

module.exports = { getFilesInfo };
