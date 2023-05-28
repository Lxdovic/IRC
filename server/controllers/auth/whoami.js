const User = require("../../models/User");
const GuestUser = require("../../models/GuestUser");
const accessToken = require("../../middlewares/accessToken");

module.exports = (app) => {
  app.get("/api/whoami", accessToken, async (req, res) => {
    try {
      let user = await User.findOne(
        { _id: req.user.id },
        { __v: 0, password: 0 }
      );

      if (!user) {
        let guest = await GuestUser.findOne({ _id: req.user.id }, { __v: 0 });

        if (!guest) {
          return res.status(400).json({ message: "Invalid user." });
        }

        return res.json({ user: guest });
      }

      res.json({ user });
    } catch (err) {
      console.log(err);
    }
  });
};
