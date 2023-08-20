function checkRole(role) {
  return (req, res, next) => {
    if (req.session.role === role) {
      next(); // User has the required role, proceed to the route handler
    } else {
      res.status(403).send("Access denied"); // User doesn't have the required role
    }
  };
}

module.exports = { checkRole };
