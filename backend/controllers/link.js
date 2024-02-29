var db = require("../models");
const { validationResult } = require("express-validator");
var Link = db.link;
var Department = db.departments;
const { linkvalidation } = require("../validations/validation");
const { Op } = require("sequelize");

const addLink = [
  linkvalidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { appname, link } = req.body;
      const data = await Link.create({
        App_Name: appname,
        Link: link,
        Department_id: req.user.DeptId,
        Created_By: req.user.Username,
      });
      const linkdata = await Link.findOne({
        where: { id: data.id },
        include: [
          {
            model: Department,
            as: "departments",
          },
        ],
      });
      res.status(200).json({ data: linkdata });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const getLink = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const { search,department } = req.body;
  try {
    const options = {
      where: [],
    };
    if (department) {
      options.where.push({ Department_id: department });
    }
    if (search) {
      options.where.push({
        App_Name: {
          [Op.like]: `%${search}%`,
        },
      });
    }
    const totalCount = await Link.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const data = await Link.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      where: options.where,
      include: [
        {
          model: Department,
          as: "departments",
        },
      ],
    });
    res.status(200).send({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateLink = async (req, res) => {
  const { appname, link } = req.body;
  try {
    const data = await Link.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Department,
          as: "departments",
        },
      ],
    });
    if (data) {
      data.App_Name = appname;
      data.Link = link;
      data.Department_id = req.user.DeptId;
      data.Created_By = req.user.Username;
      await data.save();
      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const [updatedRowCount] = await Link.update(
      {
        Deleted_By: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await Link.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ data: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLink,
  getLink,
  updateLink,
  deleteLink,
};
