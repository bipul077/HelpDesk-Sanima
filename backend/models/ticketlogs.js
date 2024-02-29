module.exports = (sequelize, DataTypes) => {
  const TicketLogs = sequelize.define(
    "TicketLog",
    {
      Created_By: {
        type: DataTypes.STRING,
      },
      Assigned_to: {
        type: DataTypes.STRING,
      },
      Status: {
        type: DataTypes.INTEGER,
      },
      Ticket_Status: {
        type: DataTypes.STRING,
      },
      Time_Diff:{
        type: DataTypes.INTEGER,
      }
    },

    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "TicketLog", // We need to choose the model name what we write in inside while defining above ""
      paranoid: true,
      deletedAt: "Deleted_At",
    }
  );

  return TicketLogs;
};
