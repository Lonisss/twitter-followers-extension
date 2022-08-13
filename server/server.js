const express = require("express");
const cors = require("cors");
const { getMutual } = require("./controllers/apiIntegration.controller");

const server = express();
server.use(cors());
const PORT = process.env.PORT || 4000;

server.get("/test", (req, res) => res.json("Server up and running"));
server.get("/mutual", getMutual);

server.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
