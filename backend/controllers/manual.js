var db = require("../models");
const { validationResult } = require("express-validator");
var Manual = db.manual;
var Department = db.departments;
const { manualvalidation } = require("../validations/validation");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, db) => {
    db(null, "ManualFiles");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //path.extname(file.originalname) gives the extension of file like jpg
  },
});

const uploadmanual = [
  multer({
    storage: storage,
    limits: { fileSize: "5000000" }, //5000000 = 5mb
    fileFilter: (req, file, cb) => {
      //cb means call back function
      const fileTypes = /jpeg|jpg|png|PNG|gif|jfif|pdf|doc|DOCX|docx|xlsx/;
      const mimeTypes = fileTypes.test(file.mimetype); //for testing the image with jpeg,jpg etc
      const extname = fileTypes.test(path.extname(file.originalname)); //gets the filetypes of the images uploded from user,gives the original name of the image file

      if (mimeTypes && extname) {
        return cb(null, true);
      }
      cb("Give proper files format to upload");
    },
  }).single("Manual_File"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    next();
  },
];

const addManual = [
  manualvalidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { manualfilename } = req.body;
      const data = await Manual.create({
        Manual_File_Name: manualfilename,
        Manual_File: req.file.path,
        Department_id: req.user.DeptId,
        Created_By: req.user.Username,
      });
      const manualdata = await Manual.findOne({
        where: { id: data.id },
        include: [
          {
            model: Department,
            as: "departments",
          },
        ],
      });
      res.status(200).json({ data: manualdata });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const getManual = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const { search, department } = req.body;
  try {
    const options = {
      where: [],
    };
    if (department) {
      options.where.push({ Department_id: department });
    }
    if (search) {
      options.where.push({
        Manual_File_Name: {
          [Op.like]: `%${search}%`,
        },
      });
    }

    const totalCount = await Manual.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const data = await Manual.findAll({
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

const updateManual = async (req, res) => {
  const { manualfilename } = req.body;
  try {
    const data = await Manual.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Department,
          as: "departments",
        },
      ],
    });
    if (data) {
      fs.unlink(`${data.Manual_File}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      data.Manual_File_Name = manualfilename;
      data.Manual_File = req.file.path;
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

const deleteManual = async (req, res) => {
  try {
    const data = await Manual.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      fs.unlink(`${data.Manual_File}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      const [updatedRowCount] = await Manual.update(
        {
          Deleted_By: req.user.Username,
        },
        {
          where: { id: req.params.id },
        }
      );
      if (updatedRowCount > 0) {
        const data = await Manual.destroy({
          where: {
            id: req.params.id,
          },
        });
        res.status(200).json({ data: data });
      }
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addManual,
  uploadmanual,
  getManual,
  updateManual,
  deleteManual,
};
