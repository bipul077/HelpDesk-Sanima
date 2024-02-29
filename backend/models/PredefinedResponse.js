module.exports = (sequelize, DataTypes) => {
  const PredefinedResponse = sequelize.define(
    "PredefinedResponse",
    {
      Prereply: {
        type: DataTypes.STRING,
      },
      Deleted_By: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "PredefinedResponse",
      paranoid: true,
      deletedAt: "Deleted_At",
    }
  );
  return PredefinedResponse;
};
