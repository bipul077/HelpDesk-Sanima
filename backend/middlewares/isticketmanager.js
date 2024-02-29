var db = require("../models");
var Users = db.users;

const isticketmanager = async (req, res, next) => {
  try {
    const data = await Users.findOne({
      where: { StaffId: req.user.StaffId },
    });
    if (data) {
      if (data.role_id === 2) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = isticketmanager;
