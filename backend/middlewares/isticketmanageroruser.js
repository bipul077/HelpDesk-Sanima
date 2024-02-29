var db = require("../models");
var Users = db.users;
var Tickets = db.tickets;

const isticketmanager = async (req, res, next) => {
  try {
    const userdata = await Users.findOne({
      where: { StaffId: req.user.StaffId },
    });

    const ticketdata = await Tickets.findOne({
      where: { id: req.params.id },
    });

    if (userdata && userdata.role_id === 2) {
      next();
    } 
    else if (ticketdata && ticketdata.Assign_User === req.user.Username) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = isticketmanager;
