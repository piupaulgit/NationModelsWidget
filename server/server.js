const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const data = require("./data.json");

app.use(cors());

router.get("/getRecord", (req, res) => {
  res.status(200).send(data);
});

app.use("/", router);

app.listen("3300", () => {
  console.log("port running");
});
