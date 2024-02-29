var db = require("../models");
const { validationResult } = require("express-validator");
var EodNotice = db.eodnotice;
const {eodnoticevalidation} = require("../validations/validation");

const addnotice =[eodnoticevalidation,async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingdata = await EodNotice.findOne();
        if(existingdata){
            existingdata.Content = req.body.Content;
            existingdata.Created_By = req.user.Username;
            await existingdata.save();
            res.status(200).json(existingdata);
        }     
        else{
            const newData = await EodNotice.create({Content:req.body.Content,Created_By:req.user.Username});
            res.status(200).json(newData);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}]

const getnotice = async(req,res)=>{
    try {
        const data = await EodNotice.findOne();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

const deletenotice = async(req,res)=>{
    try {
        const [updatedRowCount] = await EodNotice.update(
          {
            Deleted_By: req.user.Username,
          },
          {
            where: { id: req.params.id },
          }
        );
        if(updatedRowCount > 0){
          const data = await EodNotice.destroy({
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
}

module.exports = {
    addnotice,
    getnotice,
    deletenotice
  };