const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const data = require("./data.json");
const path = require("path");

app.use(cors());

router.get("/getRecord", (req, res) => {
  res.status(200).send(data);
});

router.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "client", "build")));
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use("/", router);

app.listen("3300", () => {
  console.log("port running");
});
