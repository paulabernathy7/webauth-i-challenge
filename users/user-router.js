const express = require("express");
const router = express.Router();
const Users = require("./user-model");

const bcrypt = require("bcryptjs");

router.get("/api/users", validate, async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "cannot find user" });
  }
});

router.post("/api/register", async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  try {
    const users = await Users.add(user);
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/api/login", validate, (req, res) => {
  let { username } = req.headers;
  //validate method looks up the user
  res.status(200).json({ message: `Welcome ${username}!` });

  // any errors will be handled by validate() as well.
});

// custom middleware that validates the credentials passed in headers
function validate(req, res, next) {
  const { username, password } = req.headers;

  // if both the username and password headers are found...
  if (username && password) {
    // look up the user
    Users.findBy({ username })
      .first()
      .then(user => {
        // if the user is found in the DB
        // AND the password supplied hashes to the same hash
        // that is stored...
        if (user && bcrypt.compareSync(password, user.password)) {
          // go to the next middleware handler
          next();
        } else {
          // otherwise, respond with a 401
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      // if our DB model module has a problem with the request,
      // we will just return a 500 (kinda lazy of us, but it's just
      // a demo)
      .catch(err => {
        res.status(500).json({ message: "unexpected error" });
      });
    // if either the username or the password are not supplied in
    // the request headers, respond with a 400.
  } else {
    res.status(400).json({ message: "no credentials provided" });
  }
}

module.exports = router;
