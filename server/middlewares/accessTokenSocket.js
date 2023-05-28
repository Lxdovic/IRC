const jwt = require("jsonwebtoken");

module.exports = function (socket, next) {
  try {
    const token =
      socket.handshake.auth.accessToken ||
      socket.handshake.auth.accessTokenGuest;

    if (!token) return;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return;
      }

      socket.user = user;

      next();
    });
  } catch (err) {
    console.log(err);
  }
};
