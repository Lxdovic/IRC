const User = require("../../models/User");
const Room = require("../../models/Room");
const GuestUser = require("../../models/GuestUser");
const accessToken = require("../../middlewares/accessToken");
const joinRoom = require("../../utils/joinRoom");

module.exports = (app, io) => {
  app.get("/api/user", async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    try {
      const user = await User.findById(userId);

      if (user) {
        return res.json({ user });
      }

      const guest = await GuestUser.findById(userId);

      if (guest) {
        return res.json({ user: guest });
      }

      res.status(400).json({ message: "User not found" });
    } catch (err) {
      console.log(err);

      res.status(400).json({ message: "User not found" });
    }
  });

  app.get("/api/users", async (req, res) => {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      const users = await User.find({
        username: { $regex: username, $options: "i" },
      });

      const guests = await GuestUser.find({
        username: { $regex: username, $options: "i" },
      });

      res.json({ users: users.concat(guests) });
    } catch (err) {
      res.status(400).json({ message: "An error occurred." });
    }
  });

  app.patch("/api/users/nick", accessToken, async (req, res) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      const user = await User.findByIdAndUpdate(req.user.id, {
        username: username,
      });

      const guest = await GuestUser.findByIdAndUpdate(req.user.id, {
        username: username,
      });

      if (!user && !guest) {
        return res.status(404).json({ message: "User not found." });
      }

      const rooms = await Room.find({
        users: { $in: req.user.id },
      });

      const newUser =
        (await User.findById(req.user.id)) ||
        (await GuestUser.findById(req.user.id));

      rooms.forEach(async (room) => {
        await joinRoom(io, room, room._id.toString());

        io.to(room._id.toString()).emit("user_update", {
          user: newUser,
        });
      });

      res.status(200).json({ message: "Username successfully updated." });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};
