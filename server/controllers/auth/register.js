const bcrypt = require("bcrypt");
const User = require("../../models/User");

module.exports = (app) => {
  app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    console.log("register", req.body);
    // check if all fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // check if user already exists
      let user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // create user
      user = User.create({
        username,
        password: hashedPassword,
      });

      // send success message
      res.json({ message: "Account created." });
    } catch (err) {
      console.log(err);
    }
  });
};
