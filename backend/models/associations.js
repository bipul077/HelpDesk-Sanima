module.exports = (db) => {
  // Define associations here
  //category and ticket
  db.category.hasMany(db.tickets, {
    foreignKey: "Category_id",
    as: "tickets",
  });

  db.tickets.belongsTo(db.category, {
    foreignKey: "Category_id",
    as: "Category",
  });

  db.subcategories.hasMany(db.tickets, {
    foreignKey: "SubCategory_id",
    as: "tickets",
  });

  db.tickets.belongsTo(db.subcategories, {
    foreignKey: "SubCategory_id",
    as: "SubCategory",
  });

  //category and subcategory
  db.category.hasMany(db.subcategories, {
    foreignKey: "Parent_id",
    as: "subcategory",
  });

  db.subcategories.belongsTo(db.category, {
    foreignKey: "Parent_id",
    as: "Category",
  });

  //severities and subcategory
  db.severity.hasMany(db.subcategories, {
    foreignKey: "Severity_id",
    as: "subcategory",
  });

  db.subcategories.belongsTo(db.severity, {
    foreignKey: "Severity_id",
    as: "severity",
  });

  //tickets and ticketimages(ticketfiles)
  db.tickets.hasMany(db.ticketimages, {
    foreignKey: "Ticket_id",
    as: "Ticketimages",
  });

  db.ticketimages.belongsTo(db.tickets, {
    foreignKey: "Ticket_id",
    as: "tickets",
  });

  //reply and replyfiles
  db.ticketreply.hasMany(db.replyfiles, {
    foreignKey: "Reply_id",
    as: "Ticketfiles",
  });

  db.replyfiles.belongsTo(db.ticketreply, {
    foreignKey: "Reply_id",
    as: "reply",
  });

  //departments and tickets
  db.departments.hasMany(db.tickets, {
    foreignKey: "Department_id",
    as: "tickets",
  });

  db.tickets.belongsTo(db.departments, {
    foreignKey: "Department_id",
    as: "departments",
  });

  //departments and predefinedresponse
  db.departments.hasMany(db.predefinedresponse, {
    foreignKey: "Department_id",
    as: "predefines",
  });

  db.predefinedresponse.belongsTo(db.departments, {
    foreignKey: "Department_id",
    as: "departments",
  });

  //departments and manuals
  db.departments.hasMany(db.manual, {
    foreignKey: "Department_id",
    as: "manuals",
  });

  db.manual.belongsTo(db.departments, {
    foreignKey: "Department_id",
    as: "departments",
  });

  //departments and links
  db.departments.hasMany(db.link, {
    foreignKey: "Department_id",
    as: "links",
  });

  db.link.belongsTo(db.departments, {
    foreignKey: "Department_id",
    as: "departments",
  });

  //tickets and severities
  db.severity.hasMany(db.tickets, {
    foreignKey: "Severity_id",
    as: "tickets",
  });

  db.tickets.belongsTo(db.severity, {
    foreignKey: "Severity_id",
    as: "severity",
  });

  //tickets and ticketlogs
  db.tickets.hasMany(db.ticketlogs, {
    foreignKey: "ticket_id",
    as: "ticketlogs",
  });

  db.ticketlogs.belongsTo(db.tickets, {
    foreignKey: "ticket_id",
    as: "tickets",
  });

  //ticketlogs and departments
  db.departments.hasMany(db.ticketlogs, {
    foreignKey: "Department_id",
    as: "ticketlogs",
  });

  db.ticketlogs.belongsTo(db.departments, {
    foreignKey: "Department_id",
    as: "departments",
  });

  //ticketlogs and severity
  db.severity.hasMany(db.ticketlogs, {
    foreignKey: "Severity_id",
    as: "ticketlogs",
  });

  db.ticketlogs.belongsTo(db.severity, {
    foreignKey: "Severity_id",
    as: "severities",
  });

//ticketlogs and categories
  db.category.hasMany(db.ticketlogs,{
    foreignKey: "Category_id",
    as:"ticketlogs",
  })
  db.ticketlogs.belongsTo(db.category,{
    foreignKey: "Category_id",
    as:"categories",
  })
  
  //ticketlogs and subcategories
  db.subcategories.hasMany(db.ticketlogs,{
    foreignKey: "SubCategory_id",
    as: "ticketlogs",
  })
  db.ticketlogs.belongsTo(db.subcategories,{
    foreignKey: "SubCategory_id",
    as:"subcategories",
  })

  //departments and categories
  db.departments.hasMany(db.category, {
    foreignKey: "Department_id",
    as: "categories",
  });

  db.category.belongsTo(db.departments, {
    foreignKey: "Department_id",
    as: "departments",
  });

  //branch and tickets
  db.branch.hasMany(db.tickets, {
    foreignKey: "SOL_id",
    as: "tickets",
  });

  db.tickets.belongsTo(db.branch, {
    foreignKey: "SOL_id",
    as: "branch",
  });

  //tickets and ticketreplies
  db.tickets.hasMany(db.ticketreply, {
    foreignKey: "treply_id",
    as: "ticketreply",
  });

  db.ticketreply.belongsTo(db.tickets, {
    foreignKey: "treply_id",
    as: "tickets",
  });

  //ticketreplies and ticketlogs
  db.ticketreply.hasOne(db.ticketlogs, {
    foreignKey: "reply_id",
    as: "ticketlogs",
  });

  db.ticketlogs.belongsTo(db.ticketreply, {
    foreignKey: "reply_id",
    as: "ticketreply",
  });

  //admin
  //user and userroles
  db.userroles.hasMany(db.users, {
    foreignKey: "role_id",
    as: "users",
  });

  db.users.belongsTo(db.userroles, {
    foreignKey: "role_id",
    as: "userroles",
  });
  //user and categories
  db.category.hasMany(db.users, {
    foreignKey: "category_id",
    as: "users",
  });
  db.users.belongsTo(db.category, {
    foreignKey: "category_id",
    as: "Category",
  });
  //user and department
  db.departments.hasMany(db.users, {
    foreignKey: "DeptId",
    as: "users",
  });
  db.users.belongsTo(db.departments, {
    foreignKey: "DeptId",
    as: "department",
  });
};

