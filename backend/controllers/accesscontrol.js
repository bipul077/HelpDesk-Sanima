var db = require("../models");
var AccessControl = db.accesscontrols;

const addaccesscontrol = async (req, res) => {
  try {
    const data = await AccessControl.findOne({
      where: {
        STAFF_ID: req.body.STAFF_ID,
        JOB_ID: req.body.JOB_ID,
      },
    });

    if (!data) {
      let content = await AccessControl.create({
        STAFF_ID: req.body.STAFF_ID,
        JOB_ID: req.body.JOB_ID,
        ACCESS_TO_DEPT: req.body.ACCESS_TO_DEPT,
        CREATED_BY: req.user.Username,
      });
      res.status(200).json({ data: content, message: "Created" });
    } else {
      //for updating
      const combinedAccessToSol = data.ACCESS_TO_DEPT.split(",").concat(
        req.body.ACCESS_TO_DEPT.split(",")
      );
      const uniqueAccessToSol = [...new Set(combinedAccessToSol)];
      await data.update({
        UPDATED_BY: req.user.Username,
        ACCESS_TO_DEPT: uniqueAccessToSol.join(","),
      });
      res.status(200).json({ data: data, message: "Updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getaccesscontrols = async (req, res) => {
  try {
    const content = await AccessControl.findAll({});
    res.status(200).json(content);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({message:error.message});
  }
};

const deleteaccesscontrols = async (req, res) => {
  var data = await AccessControl.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(data);
};

const updateaccesscontrols = async (req, res) => {
  const { STAFF_ID, JOB_ID, ACCESS_TO_DEPT } = req.body;
  try {
    const data = await AccessControl.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      data.STAFF_ID = STAFF_ID;
      data.JOB_ID = JOB_ID;
      data.ACCESS_TO_DEPT = ACCESS_TO_DEPT;
      data.UPDATED_BY = req.user.Username;
      await data.save();
      res.status(200).json({ data: data });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({message:error.message});
  }
};

const specificaccesscontrol = async (req, res) => {
  try {
    const content = await AccessControl.findOne({
      where: {Staff_Id:req.user.StaffId }
    });
    if(content){
      res.status(200).json({success:true});
    }else{
      res.status(200).json({success:false})
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({message:error.message});
  }
};

module.exports = {
  addaccesscontrol,
  getaccesscontrols,
  deleteaccesscontrols,
  updateaccesscontrols,
  specificaccesscontrol
};
