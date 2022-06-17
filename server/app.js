const express = require("express");
const {
  getMutualFollowingsList,
} = require("./controllers/apiIntegration.controller");

const app = express();
const PORT = 4000;

app.get("/get-followers", getMutualFollowingsList);

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
