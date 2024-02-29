const { validationResult } = require("express-validator");
var db = require("../models");
var Branch = db.branch;
var Users = db.users;
var Userroles = db.userroles;
var Predefined = db.predefinedresponse;
var Department = db.departments;
var Category = db.category;
const axios = require("axios");
const {
  addroleValidation,
  addmemberValidation,
  predefinedValidation,
} = require("../validations/validation");

const syncbranches = async (req, res) => {
  try {
    const response = await axios.get("http://192.168.1.52:8090/api/branches");

    for (let key of response.data) {
      let BranchID = key.BranchID;
      let BranchName = key.BranchName;
      const [data, created] = await Branch.findOrCreate({
        where: { BranchID },
        defaults: {
          BranchName,
        },
      });
      if (!created) {
        //if not created or for updated
        data.BranchName = BranchName;
        await data.save();
      }
      //   if(BranchName==="Dhadingbesi"){
      //     break;
      //   }
    }
    res
      .status(200)
      .json({ message: "All branches updated or created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getbranches = async (req, res) => {
  try {
    const data = await Branch.findAll({});
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getrole = async (req, res) => {
  try {
    const data = await Userroles.findAll({});
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const addrole = [
  addroleValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const data = await Userroles.create({
        RoleName: req.body.rolename,
        CreatedBy: req.user.Username,
      });
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const updaterole = [
  addroleValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const data = await Userroles.findOne({
        where: { id: req.params.id },
      });
      if (data) {
        data.RoleName = req.body.rolename;
        // data.CreatedBy = req.user.Username;
        await data.save();
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const deleterole = async (req, res) => {
  try {
    const [updatedRowCount] = await Userroles.update(
      {
        DeletedBy: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await Userroles.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ data: data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const addmember = [
  addmemberValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { StaffId, role, category } = req.body;
    try {
      const content = await axios.get(
        `http://192.168.1.52:8090/api/staff/${StaffId}`
      );

      const created = await Users.findOne({ where: { StaffId: StaffId } });
      if (created) {
        res.status(409).json({ message: "User already exists" });
      } else {
        const data = await Users.create({
          StaffId: StaffId,
          Username: content.data.username,
          Name: content.data.name.fullName,
          Email: content.data.email,
          DeptId: content.data.departmentId,
          BranchName: content.data.branch.branchName,
          BranchId: content.data.branch.branchCode,
          DepartmentName: content.data.department,
          role_id: role,
          category_id: category,
          CreatedBy: req.user.Username,
        });
        if (data) {
          const updateddata = await Users.findByPk(data.id, {
            include: [
              {
                model: Userroles,
                as: "userroles",
              },
              {
                model: Category,
                as: "Category",
              },
            ],
          });
          res.status(200).json(updateddata);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const getmembers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const totalCount = await Users.count({});
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const data = await Users.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: Userroles,
          as: "userroles",
        },
        {
          model: Category,
          as: "Category",
        },
      ],
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getspecificmember = async (req, res) => {
  try {
    const data = await Users.findOne({
      where: { StaffId: req.body.StaffId },
      order: [["id", "DESC"]],
      include: [
        {
          model: Userroles,
          as: "userroles",
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updatemember = async (req, res) => {
  const { StaffId, role, category } = req.body;
  try {
    const data = await Users.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      const content = await axios.get(
        `http://192.168.1.52:8090/api/staff/${StaffId}`
      );
      data.StaffId = StaffId;
      data.role_id = role;
      data.Username = content.data.username;
      data.Name = content.data.name.fullName;
      data.Email = content.data.email;
      data.DeptId = content.data.departmentId;
      data.BranchName = content.data.branch.branchName;
      data.BranchId = content.data.branch.branchCode;
      data.DepartmentName = content.data.department;
      data.category_id = category;
      await data.save();
      const updateddata = await Users.findByPk(req.params.id, {
        include: [
          {
            model: Userroles,
            as: "userroles",
          },
          {
            model: Category,
            as: "Category"
          }
        ],
      });
      res.status(200).json(updateddata);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deletemember = async (req, res) => {
  try {
    const [updatedRowCount] = await Users.update(
      {
        DeletedBy: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await Users.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ data: data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const verifyrole = async (req, res) => {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const addresponse = [
  predefinedValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { department, prereply } = req.body;
    try {
      const data = await Predefined.create({
        Department_id: department,
        Prereply: prereply,
      });
      if (data) {
        const updateddata = await Predefined.findByPk(data.id, {
          include: [
            {
              model: Department,
              as: "departments",
            },
          ],
        });
        res.status(200).json(updateddata);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const getresponse = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const totalCount = await Predefined.count({});
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const data = await Predefined.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: Department,
          as: "departments",
        },
      ],
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteresponse = async (req, res) => {
  try {
    const [updatedRowCount] = await Predefined.update(
      {
        Deleted_By: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await Predefined.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateresponse = async (req, res) => {
  const { department, prereply } = req.body;
  try {
    const data = await Predefined.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      data.Department_id = department;
      data.Prereply = prereply;
      await data.save();
      const updatedresponse = await Predefined.findByPk(req.params.id, {
        include: [
          {
            model: Department,
            as: "departments",
          },
        ],
      });
      res.status(200).json(updatedresponse);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  syncbranches,
  getbranches,
  addrole,
  updaterole,
  deleterole,
  getrole,
  addmember,
  getmembers,
  updatemember,
  deletemember,
  verifyrole,
  getspecificmember,
  addresponse,
  deleteresponse,
  updateresponse,
  getresponse,
};
