module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define(
      "Ticket",
      {
        // Model attributes are defined here
        Ticket_Subject: {
          type: DataTypes.STRING,
        },
        User: {
          type: DataTypes.STRING,
        },
        StaffId:{
          type: DataTypes.STRING,
        },
        Assign_User:{
          type: DataTypes.STRING,        
        },
        Assign_User_Id:{
          type: DataTypes.STRING,
        },
        Ticket_Priority: {
          type: DataTypes.STRING,
        },
        Ticket_Status:{
          type: DataTypes.STRING,
        },
        Ticket_Body:{
            type: DataTypes.TEXT,
        },
        Ip:{
          type: DataTypes.STRING,
        },
        Is_Acknowledge:{
          type: DataTypes.BOOLEAN,
        },
        Acknowledge_User:{
          type: DataTypes.STRING,
        },
        FiscalYear:{
          type: DataTypes.STRING,
        }
      },
      {
        sequelize,
        modelName: "Ticket",
        paranoid: true,
        deletedAt: "Deleted_At",
      }
    );
    return Ticket;
  };
  