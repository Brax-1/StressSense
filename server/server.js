const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const http = require("http").createServer(app);
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const meetingDetailRoutes = require("./routes/meeting");

const io = require("socket.io")(http, {
  cors: {
    origin: `*`,
  },
});
const { port, mongo_url } = require("./config");
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingDetailRoutes);

const URL = mongo_url;

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err, " pls solve this error");
  });
http.listen(port, function () {
  console.log(`listening on port ${port}`);
});
