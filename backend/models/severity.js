module.exports = (sequelize, DataTypes) => {
    const Severity = sequelize.define(
      "Severity",
      {
        // Model attributes are defined here
        Name: {
          type: DataTypes.STRING,
        },
        Duration:{
          type: DataTypes.INTEGER,
        },
        CreatedBy:{
          type: DataTypes.STRING,
        },
        DeletedBy:{
          type: DataTypes.STRING,
        }
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Severity', // We need to choose the model name what we write in inside while defining above ""
        paranoid: true,
        deletedAt: 'Deleted_At'
      }
    );
    return Severity;
  };
  