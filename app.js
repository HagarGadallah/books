const express = require("express");
const morgan = require("morgan");
var routes = require("./api/routes");
var fs = require("fs");
var path = require("path");

const app = express();

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
