const jwt = require("jsonwebtoken");

module.exports = function (socket, next) {
  const token = socket.handshake.auth.accessToken;

  if (!token) return;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return;

    socket.user = user;

    next();
  });
};
