
const jwt = require("jsonwebtoken");


function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debugging line

      // Check if user's role is allowed
      if (!allowedRoles.includes(decoded.role)) {
        console.log("User role not allowed:", decoded.role); // Debugging line
        return res.status(403).json({ message: "Forbidden " });

      }

      // Attach user info to request
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

module.exports = { authorizeRoles };
