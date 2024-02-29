var db = require("../models");
const { validationResult } = require("express-validator");
var Tickets = db.tickets;
var Ticketreplies = db.ticketreply;
var Category = db.category;
var Branch = db.branch;
var Department = db.departments;
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

const { filterticketValidation,categorychangeValidation } = require("../validations/validation");

const getfilterTicket = [
  filterticketValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10;
    const { category, search, status, fiscalyear, department } = req.body;
    try {
      const options = {
        where: [],
      };
      if (category) {
        options.where.push({ Category_id: category });
      }
      if (search) {
        options.where.push({
          [Op.or]: [
            { Ticket_Subject: { [Op.like]: `%${search}%` } },
            { User: { [Op.like]: `%${search}%` } },
            { Assign_User: { [Op.like]: `%${search}%` } },
            { id: { [Op.like]: `%${search}%` } },
          ],
        });
      }
      if (status) {
        options.where.push({ Ticket_Status: status });
      }
      if (fiscalyear) {
        options.where.push({ FiscalYear: fiscalyear });
      }
      if (department) {
        options.where.push({ Department_id: department });
      }
      // if (startdate && enddate) {
      //   const startDateObj = new Date(startdate);
      //   const endDateObj = new Date(enddate);
      //   options.where.push({
      //     createdAt: { [Op.between]: [startDateObj, endDateObj] },
      //   });
      // }

      const totalCount = await Tickets.count({
        where: {
          [Sequelize.Op.and]: [
            {
              Department_id: { [Sequelize.Op.in]: req.accesstodept.split(",") },
            },
            ...options.where, // Additional conditions from options
          ],
        },
      });

      const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

      const offset = (page - 1) * limit;
      const data = await Tickets.findAll({
        order: [["id", "DESC"]],
        limit,
        offset,
        where: options.where,
        include: [
          {
            model: Category,
            as: "Category",
          },
          {
            model: Branch,
            as: "branch",
          },
          {
            model: Department,
            as: "departments",
            where: {
              DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") }, //req.user.DeptName, // Assuming 'Name' is the property in the 'Department' model you want to filter on
            },
          },
          {
            model: Ticketreplies,
            as: "ticketreply",
          },
        ],
      });

      res.status(200).json({ currentPage: page, totalPages, totalCount, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const filtercategoryticket = async (req, res) => {
  try {
    const data = await Category.findAll({
      where: {
        Department_id: { [Sequelize.Op.in]: req.accesstodept.split(",") },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const filterdepartmentticket = async (req, res) => {
  try {
    const data = await Department.findAll({
      where: {
        DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const viewaccessticket = async (req, res) => {
  try {
    const data = await Tickets.findOne({
      where: { id: req.params.id },
    });
    if(data){
      let deptarr = req.accesstodept.split(",")
      if(deptarr.includes(data.Department_id.toString()) || data.StaffId === req.user.StaffId || data.Acknowledge_User === req.user.Username){
        res.status(200).json({ success: true });
      }
      else{
        res.status(401).json({ success: false });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getfilterTicket,
  filtercategoryticket,
  filterdepartmentticket,
  viewaccessticket
};
