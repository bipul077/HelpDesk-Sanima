module.exports = (sequelize, DataTypes) => {
    const Link = sequelize.define(
      "Link",
      {
        App_Name: {
          type: DataTypes.STRING,
        },
        Link:{
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
        modelName: "Link",
        paranoid: true,
        deletedAt: "Deleted_At",
      }
    );
    return Link;
  };