require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8, // 100 MB
});

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_DEV_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const accessTokenSocket = require("./middlewares/accessTokenSocket");

io.use((socket, next) => {
  accessTokenSocket(socket, next);
});

io.on("connection", (socket) => {
  require("./controllers/chat/message")(io, socket);
});

require("./controllers/auth/login")(app);
require("./controllers/auth/register")(app);
require("./controllers/auth/whoami")(app);
require("./controllers/chat/users")(app, io);
require("./controllers/chat/rooms")(app, io);

server.listen(process.env.PORT, () => {
  console.log(`Server started: ${process.env.PORT}`);
});
