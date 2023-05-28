const User = require("../models/User");
const GuestUser = require("../models/GuestUser");

module.exports = async (io, room, destination) => {
  //   if (!room.users.includes(socket.user.id)) {
  //     return false;
  //   }

  // sender joins socket.io room
  //   if (!socket.rooms.has(destination)) {
  //     socket.join(destination);
  //   }

  // get all the sockets connected to the server
  let sockets = await io.fetchSockets();

  // find all the other users apart of the room in the database
  // and which socket they are connected with
  // then join them to the socket.io room
  for (let user of room.users) {
    let dbUser = await User.findOne({ _id: user }, { __v: 0 });
    let dbGuest = await GuestUser.findOne({ _id: user }, { __v: 0 });

    if (!dbUser && !dbGuest) {
      continue;
    }

    // find sockets with the corresponding user
    sockets.map((socket) => {
      if (
        socket.user.id === (dbUser?._id.toString() || dbGuest?._id.toString())
      ) {
        // user found, join the socket to the room
        if (!socket.rooms.has(destination)) {
          socket.join(destination);
        }
      }
    });
  }

  return true;
};
