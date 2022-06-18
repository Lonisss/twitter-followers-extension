const express = require("express");
const cors = require("cors");
const {
  getMutual,
} = require("./controllers/apiIntegration.controller");

const app = express();
app.use(cors())
const PORT = 4000;

app.get("/mutual", getMutual);

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
