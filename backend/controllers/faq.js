var db = require("../models");
const { validationResult } = require("express-validator");
var Faq = db.faq;
const { faqvalidation } = require("../validations/validation");
const { Op } = require("sequelize");

const addfaq = [
  faqvalidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { question, answer } = req.body;
      const data = await Faq.create({
        Question: question,
        Answer: answer,
        Created_By: req.user.Username,
      });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const getfaq = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const { search } = req.body;
  try {
    const options = {
      where:[]
    }
    if (search) {
      options.where.push({
        Question: {
          [Op.like]: `%${search}%`
        }
      });
    }
    const totalCount = await Faq.count({where:options.where});
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const data = await Faq.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      where:options.where
    });
    res.status(200).send({currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updatefaq = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const data = await Faq.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      data.Question = question;
      data.Answer = answer;
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

const deletefaq = async (req, res) => {
  try {
    const [updatedRowCount] = await Faq.update(
      {
        Deleted_By: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await Faq.destroy({
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
  addfaq,
  getfaq,
  updatefaq,
  deletefaq
};
