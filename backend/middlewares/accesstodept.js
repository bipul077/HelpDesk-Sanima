var db = require("../models");
var AccessControl = db.accesscontrols;

const accesstodept = async (req, res, next) => {
  try {
    const data = await AccessControl.findOne({
      where: { Staff_Id: req.user.StaffId },
    });
    if (data) {
      req.accesstodept = data.ACCESS_TO_DEPT;
      next();
    } else {
      req.accesstodept = req.user.DeptId;
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = accesstodept;
