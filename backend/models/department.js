module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define(
      "Department",
      {
        // Model attributes are defined here
        Name: {
          type: DataTypes.STRING,
        },
        DEPT_ID:{
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Email:{
          type:DataTypes.STRING,
        },
        CreatedBy:{
          type: DataTypes.STRING,
        }
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Department', // We need to choose the model name what we write in inside while defining above ""
        paranoid: true,
        deletedAt: 'Deleted_At'
      }
    );
    return Department;
  };
  