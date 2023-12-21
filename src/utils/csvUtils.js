const csv = require("csvtojson");

const fromString = async (csvString) => {
  return csv().fromString(csvString);
};

module.exports = { fromString };
