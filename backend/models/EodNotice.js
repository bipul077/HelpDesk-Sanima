module.exports = (sequelize, DataTypes) => {
    const EodNotice = sequelize.define(
      "EodNotice",
      {
        Content: {
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
        modelName: "EodNotice",
        paranoid: true,
        deletedAt: "Deleted_At",
      }
    );
    return EodNotice;
  };
  