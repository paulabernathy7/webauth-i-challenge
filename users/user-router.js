const express = require("express");
const router = express.Router();
const Users = require("./user-model");

router.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "cannot find user" });
  }
});
module.exports = router;
