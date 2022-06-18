const express = require("express");
const {
  getMutual,
} = require("./controllers/apiIntegration.controller");

const app = express();
const PORT = 4000;

app.get("/mutual", getMutual);

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
