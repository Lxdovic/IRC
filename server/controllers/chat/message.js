const Room = require("../../models/Room");
const Message = require("../../models/Message");
const joinRoom = require("../../utils/joinRoom");
const fs = require("fs");
const { v4 } = require("uuid");

module.exports = (io, socket) => {
  socket.on("message", async (data) => {
    const { destination, content, attachments } = data;

    if (!destination || !content) {
      return;
    }

    try {
      let files = [];

      if (attachments && attachments.length > 0) {
        attachments.forEach((attachment) => {
          const type = attachment.type.split("/")[0];
          const name = v4() + "." + attachment.type.split("/")[1].split(";")[0];

          files.push({ name, type });

          fs.writeFile(`./uploads/${type}s/` + name, attachment.data, (err) => {
            if (err) {
              console.log(err);
            }

            console.log("File uploaded " + name);
          });
        });
      }

      const message = await Message.create({
        content,
        author: socket.user.id,
        destination,
        attachments: files,
      });

      if (!message) {
        return;
      }

      const room = await Room.findByIdAndUpdate(destination, {
        $push: { messages: message },
      });

      await joinRoom(io, room, destination);

      io.to(destination).emit("message", {
        content,
        destination,
        author: socket.user.id,
        attachments: files,
        date: Date.now(),
      });
    } catch (err) {
      return console.log(err);
    }
  });
};
