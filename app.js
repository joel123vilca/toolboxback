const express = require("express");
const cors = require("cors");

const filesRoutes = require("./src/routes/filesRoutes");

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/files", filesRoutes);

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.listen(port, () => {
  console.log(`Start in port: ${port}`);
});

module.exports = app;
