module.exports = (sequelize, DataTypes) => {
    const FAQ = sequelize.define(
      "Faq",
      {
        Question: {
          type: DataTypes.STRING,
        },
        Answer:{
          type: DataTypes.TEXT,
        },
        Created_By:{
          type: DataTypes.STRING,
        },
        Deleted_By: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "FAQ",
        paranoid: true,
        deletedAt: "Deleted_At",
      }
    );
    return FAQ;
  };