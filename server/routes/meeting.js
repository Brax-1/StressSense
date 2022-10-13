const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  const user = { name: "meeting" };
  res.json(user);
});

module.exports = router;
