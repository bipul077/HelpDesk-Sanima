module.exports = (sequelize, DataTypes) => {
    const TicketReply = sequelize.define(
      "TicketReply",
      {
        Replied_By: {
          type: DataTypes.STRING,
        },
        Replies: {
          type: DataTypes.TEXT,
        }
      },
  
      {
        sequelize, 
        modelName: "TicketReply", 
        paranoid: true,
        deletedAt: "Deleted_At",
      }
    );
  
    return TicketReply;
  };
  