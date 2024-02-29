module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define(
    "SubCategory",
    {
      // Model attributes are defined here
      Name: {
        type: DataTypes.STRING,
      },
      Description: {
        type: DataTypes.TEXT,
      },
      CreatedBy: {
        type: DataTypes.STRING,
      },
      DeletedBy: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "SubCategory",
      paranoid: true,
      deletedAt: "Deleted_At",
    }
  );
  return SubCategory;
};
