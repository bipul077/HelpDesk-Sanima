module.exports = (sequelize, DataTypes) => {
    const TicketImages = sequelize.define(
      "TicketFiles",
      {
        // Model attributes are defined here
        Name: {
          type: DataTypes.STRING,
        }
      },
      {}
    );
    return TicketImages;
  };
  