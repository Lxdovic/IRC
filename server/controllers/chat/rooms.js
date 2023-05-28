const User = require("../../models/User");
const GuestUser = require("../../models/GuestUser");
const Room = require("../../models/Room");
const accessToken = require("../../middlewares/accessToken");
const joinRoom = require("../../utils/joinRoom");

module.exports = (app, io) => {
  app.patch("/api/room/:id", accessToken, async (req, res) => {
    const { id } = req.params;
    const { name, isPrivate } = req.body;

    if (!name && !isPrivate) {
      return res.status(400).json({ message: "No data provided" });
    }

    try {
      const room = await Room.findById(id);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.creator.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }

      const newRoom = await Room.findByIdAndUpdate(id, { name, isPrivate });

      await joinRoom(io, room, room._id.toString());

      io.to(room._id.toString()).emit("room_update");

      res.json({ message: "Room successfully updated", room: newRoom });
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/api/rooms", accessToken, async (req, res) => {
    const { users, name } = req.body;

    try {
      if (users.includes(req.user.id)) {
        return res.status(400).json({ message: "Invalid users" });
      }

      users.push(req.user.id);

      const usersResult = await User.find({
        _id: { $in: users },
      });

      const guestResult = await GuestUser.find({
        _id: { $in: users },
      });

      const allUsers = usersResult.concat(guestResult);

      if (allUsers.length !== users.length) {
        return res.status(400).json({ message: "Invalid users" });
      }

      const room = await Room.create({
        users,
        name: name || "New room",
        creator: req.user.id,
      });

      if (!room) {
        return res
          .status(400)
          .json({ message: "Room was not created, retry later" });
      }

      await joinRoom(io, room, room._id.toString());

      io.to(room._id.toString()).emit("room_update");

      res.json({ message: "Room successfully created", room });
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/api/rooms", accessToken, async (req, res) => {
    try {
      const rooms = await Room.find({
        users: { $in: req.user.id },
      });

      res.json({ rooms });
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/api/rooms/all", accessToken, async (req, res) => {
    try {
      const rooms = await Room.find({ isPrivate: false });
      const availablePrivateRooms = await Room.find({
        isPrivate: true,
        users: { $in: req.user.id },
      });
      res.json({ rooms: rooms.concat(availablePrivateRooms) });
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/api/rooms/by-name/:name", accessToken, async (req, res) => {
    const { name } = req.params;
    try {
      const rooms = await Room.find({
        name: { $regex: name, $options: "i" },
        isPrivate: false,
      });
      const availablePrivateRooms = await Room.find({
        name: { $regex: name, $options: "i" },
        isPrivate: true,
        users: { $in: req.user.id },
      });
      res.json({ rooms: rooms.concat(availablePrivateRooms) });
    } catch (err) {
      console.log(err);
    }
  });

  app.patch("/api/room/join/:id", accessToken, async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findById(id);
      const user =
        (await User.findById(req.user.id)) ||
        (await GuestUser.findById(req.user.id));

      if (!room) return res.status(404).json({ message: "Room not found." });

      if (!user) return res.status(404).json({ message: "User not found." });

      if (room.isPrivate)
        return res
          .status(403)
          .json({ message: "This room is private. You cannot join it." });

      if (room.users.includes(user._id.toString())) {
        return res
          .status(403)
          .json({ message: "You are already a member of this room." });
      }

      const log = {
        isLog: true,
        user: req.user.id,
        action: `${user.username} joined the room.`,
        date: Date.now(),
      };

      room.logs.push(log);

      await Room.findByIdAndUpdate(id, {
        users: room.users.filter((user) => user !== req.user.id),
        logs: room.logs,
      });

      room.users.push(user._id.toString());

      await Room.findByIdAndUpdate(id, { users: room.users });

      await joinRoom(io, room, room._id.toString());

      io.to(id).emit("room_log", { log, room: room._id.toString() });
      io.to(id).emit("room_update");

      res
        .status(200)
        .json({ message: `Successfully joined room ${room.name}.` });
    } catch (error) {
      console.log(error);
    }
  });

  app.patch("/api/room/join/by-name/:name", accessToken, async (req, res) => {
    const { name } = req.params;

    try {
      const room = await Room.findOne({ name: name });

      if (!room) return res.status(404).json({ message: "Room not found." });

      const user =
        (await User.findById(req.user.id)) ||
        (await GuestUser.findById(req.user.id));

      if (!user) return res.status(404).json({ message: "User not found." });

      if (room.isPrivate)
        return res
          .status(403)
          .json({ message: "This room is private. You cannot join it." });

      if (room.users.includes(user._id.toString())) {
        return res
          .status(403)
          .json({ message: "You are already a member of this room." });
      }

      const log = {
        isLog: true,
        user: req.user.id,
        action: `${user.username} joined the room.`,
        date: Date.now(),
      };

      const newRoom = await Room.findOneAndUpdate(
        { name },
        {
          users: [...room.users, user._id.toString()],
          logs: [...room.logs, log],
        }
      );

      await joinRoom(io, newRoom, newRoom._id.toString());

      io.to(room._id.toString()).emit("room_log", {
        log,
        room: room._id.toString(),
      });
      io.to(room._id.toString()).emit("room_update");

      res
        .status(200)
        .json({ message: `Successfully joined room ${room.name}.` });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.patch("/api/room/leave/:id", accessToken, async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findById(id);
      const user =
        (await User.findById(req.user.id)) ||
        (await GuestUser.findById(req.user.id));

      if (!room) return res.status(404).json({ message: "Room not found." });

      if (!user) return res.status(404).json({ message: "User not found." });

      if (!room.users.includes(user._id.toString())) {
        return res
          .status(403)
          .json({ message: "You are not a member of this room." });
      }

      if (room.creator === user._id.toString()) {
        return res.status(400).json({
          message:
            "You can't leave this room because you own it. Please delete it instead.",
        });
      }

      const log = {
        isLog: true,
        user: req.user.id,
        action: `${user.username} left the room.`,
        date: Date.now(),
      };

      room.logs.push(log);

      await Room.findByIdAndUpdate(id, {
        users: room.users.filter((user) => user !== req.user.id),
        logs: room.logs,
      });

      await joinRoom(io, room, room._id.toString());

      io.to(id).emit("room_log", { log, room: room._id.toString() });
      io.to(id).emit("room_update");

      res.status(200).json({ message: `Successfully left room ${room.name}.` });
    } catch (error) {
      console.log(error);
    }
  });

  app.delete("/api/room/:id", accessToken, async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findById(id);
      const user =
        (await User.findById(req.user.id)) ||
        (await GuestUser.findById(req.user.id));

      if (!room) return res.status(404).json({ message: "Room not found." });

      if (!user) return res.status(404).json({ message: "User not found." });

      if (!room.creator === user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not the creator of this room." });
      }

      await Room.findByIdAndRemove(id);

      await joinRoom(io, room, room._id.toString());

      io.to(room._id.toString()).emit("room_update");

      res
        .status(200)
        .json({ message: `Successfully deleted room ${room.name}.` });
    } catch (error) {
      console.log(error);
    }
  });

  app.delete("/api/room/by-name/:name", accessToken, async (req, res) => {
    const { name } = req.params;

    try {
      const room = await Room.findOne({ name });
      const user =
        (await User.findById(req.user.id)) ||
        (await GuestUser.findById(req.user.id));

      if (!room) return res.status(404).json({ message: "Room not found." });

      if (!user) return res.status(404).json({ message: "User not found." });

      if (!room.creator === user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not the creator of this room." });
      }
      await Room.findOneAndRemove({ name });

      await joinRoom(io, room, room._id.toString());

      io.to(room._id.toString()).emit("room_update");

      res
        .status(200)
        .json({ message: `Successfully deleted room ${room.name}.` });
    } catch (error) {
      console.log(error);
    }
  });
};
