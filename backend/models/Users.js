module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        // Model attributes are defined here
        StaffId:{
            type: DataTypes.STRING,
        },
        Username: {
          type: DataTypes.STRING,
        },
        Name: {
          type: DataTypes.STRING,
        },
        Email:{
          type: DataTypes.STRING,        
        },
        BranchName: {
          type: DataTypes.STRING,
        },
        BranchId:{
            type: DataTypes.INTEGER,
        },
        DepartmentName:{
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
        modelName: "User", 
        paranoid: true,
        deletedAt: "Deleted_At",
      }
    );
    return User;
  };
  