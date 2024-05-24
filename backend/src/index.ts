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

let messages: {
  message: string;
  author: string;
  roomId: string;
}[] = [];

let visible = false;

io.on("connection", (socket) => {
  let roomId = "";
  console.log(`user ${socket.id} connected`);

  socket.on("joinRoom", (data) => {
    roomId = data.roomId;
    socket.join(data.roomId);
  });

  socket.emit("previousMessage", messages);

  socket.on("setVisible", (data: { visible: boolean; roomId: string }) => {
    visible = data.visible

    io.to(roomId).emit(
      "visibleChanged",
      { visible }
    );
  })

  socket.on(
    "sendMessage",
    (data: { message: string; author: string; roomId: string }) => {

      let existing = messages.find(a => a.author === data.author && a.roomId === data.roomId);

      if (existing) {
        messages[messages.indexOf(existing)] = {
          author: existing.author,
          message: data.message,
          roomId: existing.roomId
        }
      } else {
        messages.push(data);
      }

      io.to(roomId).emit(
        "receivedMessage",
        messages.filter((a) => a.roomId === data.roomId)
      );
    }
  );

  socket.on("disconnect", function () {
    console.log(`user ${socket.id} disconnected`);
  });
});

httpServer.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
