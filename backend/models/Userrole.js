module.exports = (sequelize, DataTypes) => {
  const Userrole = sequelize.define(
    "Userrole",
    {
      // Model attributes are defined here
      RoleName: {
        type: DataTypes.STRING,
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
      modelName: "Userrole",
      paranoid: true,
      deletedAt: "Deleted_At",
    }
  );
  return Userrole;
};
