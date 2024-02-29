module.exports = (sequelize, DataTypes) => {
    const Manual = sequelize.define(
      "Manual",
      {
        Manual_File_Name: {
          type: DataTypes.STRING,
        },
        Manual_File:{
          type: DataTypes.STRING,
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
        modelName: "Manual",
        paranoid: true,
        deletedAt: "Deleted_At",
      }
    );
    return Manual;
  };