import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3333;

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.post("/message", (req, res) => {
  io.emit("message", req.body);
  return res.json({ ok: true }).status(201);
});

let messages: {
  message: string;
  author: string;
  roomId: string;
}[] = [];
io.on("connection", (socket) => {
  let roomId = "";
  console.log("user connected");

  socket.on("joinRoom", (data) => {
    roomId = data.roomId;
    socket.join(data.roomId);
  });

  socket.emit("previousMessage", messages);

  socket.on(
    "sendMessage",
    (data: { message: string; author: string; roomId: string }) => {
      messages.push(data);
      io.to(roomId).emit(
        "receivedMessage",
        messages.filter((a) => a.roomId === data.roomId)
      );
    }
  );

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

httpServer.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
