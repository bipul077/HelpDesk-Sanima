module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
      "Category",
      {
        // Model attributes are defined here
        Name: {
          type: DataTypes.STRING,
        },
        Description: {
          type: DataTypes.TEXT,
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
        modelName: 'Category', // We need to choose the model name what we write in inside while defining above ""
        paranoid: true,
        deletedAt: 'Deleted_At'
      }
    );
    return Category;
  };
  