const db = require("../data/db-config");

module.exports = {
  find
  // findBy,
  // findById,
  //     add
};

function find() {
  return db("users").select("id", "username", "password");
}
