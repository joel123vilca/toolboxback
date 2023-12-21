const express = require("express");
const filesRoutes = require("./src/routes/filesRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/files", filesRoutes);

app.listen(port, () => {
  console.log(`Start in port: ${port}`);
});
