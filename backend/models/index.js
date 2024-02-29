const { Sequelize,DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('HelpDesk', 'test_user', 'sanima@123', {
    host: '192.168.3.7',
    logging: false,
    dialect: 'mssql',
    timezone: '05:45',
    pool: {
      max: 50,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.tickets = require('./tickets')(sequelize,DataTypes)
  db.category = require('./category')(sequelize,DataTypes)
  db.ticketimages = require('./ticketfiles')(sequelize,DataTypes)
  db.subcategories = require('./subcategory')(sequelize,DataTypes)
  db.departments = require('./department')(sequelize,DataTypes)
  db.severity = require('./severity')(sequelize,DataTypes)
  db.ticketlogs = require('./ticketlogs')(sequelize,DataTypes)
  db.branch = require('./branch')(sequelize,DataTypes)
  db.ticketreply = require('./ticketreply')(sequelize,DataTypes)
  db.users = require('./Users')(sequelize,DataTypes)
  db.userroles = require('./Userrole')(sequelize,DataTypes)
  db.accesscontrols = require('./AccessControl')(sequelize,DataTypes)
  db.predefinedresponse = require('./PredefinedResponse')(sequelize,DataTypes)
  db.eodnotice = require('./EodNotice')(sequelize,DataTypes)
  db.faq = require('./faq')(sequelize,DataTypes)
  db.manual = require('./Manual')(sequelize,DataTypes)
  db.link = require('./Link')(sequelize,DataTypes)
  db.replyfiles = require('./replyfiles')(sequelize,DataTypes)

  const createAssociations = require('./associations');
  createAssociations(db);

  db.sequelize.sync({force:false});
  module.exports = db