const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "secretKey");
    req.userid = decoded.userid;
    req.role = decoded.role;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = {
  verifyAdmin,
};
