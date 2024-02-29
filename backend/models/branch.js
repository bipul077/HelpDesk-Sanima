module.exports = (sequelize, DataTypes) => {
    const branch = sequelize.define(
      "Branch",
      {
        // Model attributes are defined here
        BranchName: {
          type: DataTypes.STRING,
        },
        BranchID:{
          type: DataTypes.INTEGER,
          primaryKey: true,
        }
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Branch', // We need to choose the model name what we write in inside while defining above ""
        paranoid: true,
        deletedAt: 'Deleted_At'
      }
    );
    return branch;
  };
  