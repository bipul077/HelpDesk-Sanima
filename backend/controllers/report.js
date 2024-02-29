var db = require("../models");
const { validationResult } = require("express-validator");
var Tickets = db.tickets;
var Category = db.category;
var Category = db.category;
var SubCategory = db.subcategories;
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { reportvalidation } = require("../validations/validation");
const {format} = require('date-fns');

const ticketssolvedbystaff = async (req, res) => {
  const { startdate, enddate } = req.body;
  try {
    const startDateObj = format(new Date(startdate),"yyy-MM-dd HH:mm:ss")
    const endDateObj = format(new Date(enddate),"yyy-MM-dd 23:59:59")
    let closedTicketsCount = await Tickets.findAll({
      attributes: [
        "Assign_User",
        [Sequelize.fn("count", Sequelize.col("Assign_User")), "ticketsolved"],
      ],
      where: {
        updatedAt: { [Op.between]: [startDateObj, endDateObj] },
        Ticket_Status: "Closed",
        Department_id: parseInt(req.user.DeptId),
      },
      group: ["Assign_User"],
    });
    res.status(200).json(closedTicketsCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const categorybystaff = async (req, res) => {
  const { startdate, enddate } = req.body;
  try {
    const startDateObj = format(new Date(startdate),"yyy-MM-dd HH:mm:ss")
    const endDateObj = format(new Date(enddate),"yyy-MM-dd 23:59:59")
    let categoryTicketsCount = await Tickets.findAll({
      attributes: [
        [Sequelize.col("Category.Name"), "Category_name"], // Select the Category's name
        [Sequelize.col("Assign_User"), "Assign_User"],
        [
          Sequelize.fn("count", Sequelize.col("Assign_User")),
          "categoryticketsolvedbyuser",
        ],
      ],
      include: [
        {
          model: Category,
          as: "Category",
          attributes: [],
        },
      ],
      where: {
        updatedAt: { [Op.between]: [startDateObj, endDateObj] },
        Ticket_Status: "Closed",
        Department_id: parseInt(req.user.DeptId),
      },
      group: ["Category.Name", "Assign_User"], // Group by Category Name and Assign_User
    });

    res.status(200).json(categoryTicketsCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const hrreport = [
  reportvalidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fiscalyear, status } = req.body;
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 9999999;
    try {
      let options;
      if (status === "Closed") {
        options = {
          where: [
            { Ticket_Status: "Closed" },
            { FiscalYear: fiscalyear },
            { Department_id: parseInt(req.user.DeptId) },
          ],
        };
      } else {
        options = {
          where: {
            [Op.or]: [
              { Ticket_Status: "In Progress" },
              { Ticket_Status: "New" },
            ],
            FiscalYear: fiscalyear,
            Department_id: parseInt(req.user.DeptId),
          },
        };
      }
      const totalCount = await Tickets.count({ where: options.where });
      const totalPages = Math.ceil(totalCount / limit);
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
            model: SubCategory,
            as: "SubCategory",
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

module.exports = {
  ticketssolvedbystaff,
  categorybystaff,
  hrreport,
};
