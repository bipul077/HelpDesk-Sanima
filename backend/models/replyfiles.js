module.exports = (sequelize, DataTypes) => {
    const ReplyFiles = sequelize.define(
      "ReplyFiles",
      {
        // Model attributes are defined here
        Name: {
          type: DataTypes.STRING,
        }
      },
      {}
    );
    return ReplyFiles;
  };
  