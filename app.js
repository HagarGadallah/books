const express = require("express");
const morgan = require("morgan");
const db = require("./api/db/db");
var routes = require("./api/routes");
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/", routes);

app.listen(3000, () => console.log("App is up and listening on port 3000"));
