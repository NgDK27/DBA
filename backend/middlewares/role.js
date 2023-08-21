function checkRole(role) {
  return (req, res, next) => {
    console.log(req.session);
    if (req.session.role === role) {
      console.log("oke");
      next(); // User has the required role, proceed to the route handler
    } else {
      res.status(403).send("Access denied"); // User doesn't have the required role
    }
  };
}

function checkID(id) {
  return (req, res, next) => {
    console.log(req.session);
    if (req.session.user_id === id) {
      console.log("oke");
      next(); // User has the required role, proceed to the route handler
    } else {
      res.status(403).send("Access denied"); // User doesn't have the required role
    }
  };
}

module.exports = { checkRole, checkID };
