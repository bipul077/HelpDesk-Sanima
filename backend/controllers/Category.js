const multer = require("multer");
const path = require("path");
var db = require("../models");
var Category = db.category;
var SubCategory = db.subcategories;
var Departments = db.departments;
var Severity = db.severity;
const axios = require("axios");
const { body, validationResult } = require("express-validator");

const addcategoryValidation = [
  body("Name", "Enter a valid Name").isLength({ min: 3 }),
  body("Description", "Enter a valid Description").isLength({ min: 1 }),
  body("Department", "Enter a valid Department").isLength({ min: 1 }),
];

const storage = multer.diskStorage({
  destination: (req, file, db) => {
    db(null, "TicketImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //path.extname(file.originalname) gives the extension of file like jpg
  },
});

const upload = [
  multer({
    storage: storage,
    limits: { fileSize: "5000000" }, //5000000 = 5mb
    fileFilter: (req, file, cb) => {
      //cb means call back function
      const fileTypes = /jpeg|jpg|png|gif|PNG|jfif/;
      const mimeTypes = fileTypes.test(file.mimetype); //for testing the image with jpeg,jpg etc
      const extname = fileTypes.test(path.extname(file.originalname)); //gets the filetypes of the images uploded from user,gives the original name of the image file

      if (mimeTypes && extname) {
        return cb(null, true);
      }
      cb("Give proper files format to upload");
    },
  }).array("Image"),
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Image is required" });
    }
    const imageUrls = req.files.map((file) => {
      return path.join("TicketImages", file.filename);
    });

    res.status(400).json({ imageUrls });
  },
];

var addCategory = [
  addcategoryValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { Name, Description, Department } = req.body;
      let info = {
        Name: Name,
        Description: Description,
        Department_id: Department,
        CreatedBy: req.user.Username,
      };
      const content = await Category.create(info);

      if (content) {
        const updatedcontent = await Category.findByPk(content.id, {
          include: [
            {
              model: Departments,
              as: "departments",
            },
          ],
        });
        res.status(200).json(updatedcontent);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: error.message });
    }
  },
];

const addSubCategory = async (req, res) => {
  try {
    const { Name, Description, Subcategory, severity } = req.body;

    const subCategory = await SubCategory.create({
      Name: Name,
      Description: Description,
      // Department: Department,
      Parent_id: Subcategory,
      Severity_id: severity || null,
      CreatedBy: req.user.Username,
    });

    if (!subCategory) {
      return res.status(400).send("SubCategory creation failed");
    }

    const subCategoryWithAssociations = await SubCategory.findByPk(
      subCategory.id,
      {
        include: [
          {
            model: Category,
            as: "Category",
            include: [
              {
                model: Departments,
                as: "departments",
              },
            ],
          },
          {
            model: Severity,
            as: "severity",
          },
        ],
      }
    );

    res.status(200).json(subCategoryWithAssociations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10;
  try {
    const totalCount = await Category.count({});
    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
    const offset = (page - 1) * limit;

    const data = await Category.findAll({
      order: [["Name", "ASC"]],
      limit,
      offset,
      include: [
        {
          model: Departments,
          as: "departments",
        },
      ],
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

//category
const updateCategory = async (req, res) => {
  const { Name, Department, Description } = req.body;
  try {
    const data = await Category.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      data.Name = Name;
      data.Department_id = Department;
      data.Description = Description;
      // data.Category_Parent = Category_Parent;
      await data.save();
      const updatedCategory = await Category.findByPk(req.params.id, {
        include: [
          {
            model: Departments,
            as: "departments",
          },
        ],
      });
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

//subcategory
const updateSubCategory = async (req, res) => {
  const { Name, Description, Category_Parent, severity } = req.body;

  try {
    const [updatedRowCount] = await SubCategory.update(
      {
        Name: Name,
        Description: Description,
        Parent_id: Category_Parent,
        Severity_id: severity,
      },
      {
        where: { id: req.params.id },
        returning: true, // This option returns the updated record(s)
      }
    );

    if (updatedRowCount) {
      // Fetch the updated SubCategory with associated Category and Department
      const updatedSubCategory = await SubCategory.findByPk(req.params.id, {
        include: [
          {
            model: Category,
            as: "Category",
            include: [
              {
                model: Departments,
                as: "departments",
              },
            ],
          },
          {
            model: Severity,
            as: "severity",
          },
        ],
      });

      if (!updatedSubCategory) {
        return res.status(404).send("Updated SubCategory not found");
      }

      res.status(200).json(updatedSubCategory);
    } else {
      res.status(404).send("SubCategory not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

//category
const deleteCategory = async (req, res) => {
  try {
    const [updatedRowCount] = await Category.update(
      {
        DeletedBy: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await Category.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ data: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

//subcategory
const deleteSubCategory = async (req, res) => {
  try {
    const [updatedRowCount] = await SubCategory.update(
      {
        DeletedBy: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await SubCategory.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ data: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getspecificcategory = async (req, res) => {
  try {
    const data = await Category.findAll({
      where: { Department_id: req.body.Department || req.user.DeptId},
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getspecificsubcategory = async (req, res) => {
  try {
    const data = await SubCategory.findAll({
      where: { Parent_id: req.params.id },
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getsubcategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10;
  try {
    const totalCount = await SubCategory.count({});
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const data = await SubCategory.findAll({
      order: [["Name", "ASC"]],
      limit,
      offset,
      include: [
        {
          model: Category,
          as: "Category",
          include: [
            {
              model: Departments,
              as: "departments",
            },
          ],
        },
        {
          model: Severity,
          as: "severity",
        },
      ],
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mesage: error.message });
  }
};

const getallstaffs = async (req, res) => {
  try {
    const search = req.query.name;

    const response = await axios.get(
      `http://192.168.1.52:8090/api/central/staffs?DepartmentID=${req.user.DeptId}`
    );
    const filteredStaffs = response.data.filter((staff) => {
      return staff.Username.toLowerCase().includes(search.toLowerCase()); // You can adjust the filtering condition as needed
    });
    res.status(200).json(filteredStaffs);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getspecificSeverity = async (req, res) => {
  try {
    const data = await SubCategory.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Severity,
          as: "severity",
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getspecificcategory,
  getallstaffs,
  upload,
  getsubcategory,
  addSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getspecificsubcategory,
  getspecificSeverity,
};
