const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./config/db/index");
const app = express();
const port = 5000;
// app.set("views", "views")
app.use(cookieParser());
app.use(express.json());
db.connect();

const userRouter = require("./Routes/User");
app.use("/user", userRouter);
app.listen(port, () => console.log("App is listening"));
