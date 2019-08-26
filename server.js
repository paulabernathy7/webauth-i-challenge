const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./users/user-router");

const server = express();

const sessionOptions = {
  name: "sessioncookie",
  secret: "cookies for the sessions",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: true,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("./data/db-config"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60
  })
};

server.get("/", (req, res) => {
  res.send("It works");
});

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionOptions));
server.use(userRouter);

module.exports = server;
