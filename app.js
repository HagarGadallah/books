const express = require("express");
const morgan = require("morgan");
var routes = require("./api/routes");
const fs = require("fs");
const path = require("path");
const pug = require("pug");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", pug);

app.use(express.json());

//for logs
var accessLogStream = fs.createWriteStream(path.join("./logs/", "access.log"), {
  flags: "a"
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(morgan("dev"));

app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App is up and listening on port 3000"));
