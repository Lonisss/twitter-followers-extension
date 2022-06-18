const express = require("express");
const cors = require("cors");
const { getMutual } = require("./controllers/apiIntegration.controller");
const { env } = require("process");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.get("/mutual", getMutual);

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
