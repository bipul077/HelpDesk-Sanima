module.exports = (sequelize, DataTypes) => {
    const AccessControl = sequelize.define(
      "AccessControl",
      {
        // Model attributes are defined here
        STAFF_ID: {
          type: DataTypes.STRING,
        },
        JOB_ID:{
            type: DataTypes.STRING,
        },
        ACCESS_TO_DEPT:{
            type: DataTypes.STRING,
        },
        CREATED_BY:{
            type: DataTypes.STRING,
        },
        UPDATED_BY: {
            type: DataTypes.STRING,
        },
        DELETED_BY:{
            type: DataTypes.STRING,
        },
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'AccessControl', // We need to choose the model name what we write in inside while defining above ""
        paranoid: true,
        deletedAt: 'Deleted_At'
      }
    );
    return AccessControl;
  };
  