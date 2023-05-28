const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const GuestUser = require("../../models/GuestUser");

module.exports = (app) => {
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
      const user = await User.findOne({ username });

      if (!user || user.isGuest) {
        return res.status(400).json({ msg: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ message: "Login success", accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });

  app.post("/api/guest/login", async (req, res) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    try {
      const guest = await GuestUser.create({
        username,
      });

      const accessToken = jwt.sign(
        { id: guest._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({ message: "Login success", accessToken });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
};
