const multer = require("multer");
const path = require("path");
const { validationResult } = require("express-validator");
var db = require("../models");
var ip = require("ip");
const { generateTableHtml } = require("./severity");
const {
  assignuserValidation,
  ticketreplyValidation,
  statuschangeValidation,
  switchdepartmentValidation,
  severitychangeValidation,
  acknowledgeuserValidation,
  categorychangeValidation,
} = require("../validations/validation");
var Tickets = db.tickets;
var TicketFiles = db.ticketimages;
var Category = db.category;
var Department = db.departments;
var Severity = db.severity;
var Branch = db.branch;
var Ticketlogs = db.ticketlogs;
var Ticketreplies = db.ticketreply;
var Users = db.users;
var SubCategory = db.subcategories;
var Predefined = db.predefinedresponse;
var ReplyFiles = db.replyfiles;
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const axios = require("axios");

const storage = multer.diskStorage({
  destination: (req, file, db) => {
    db(null, "Files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //path.extname(file.originalname) gives the extension of file like jpg
  },
});

const upload = [
  multer({
    storage: storage,
    limits: { fileSize: "5000000" }, //5000000 = 5mb
    fileFilter: (req, file, cb) => {
      //cb means call back function
      const fileTypes = /jpeg|JPEG|jpg|JPG|png|PNG|gif|PDF|pdf|jfif/;
      const mimeTypes = fileTypes.test(file.mimetype); //for testing the image with jpeg,jpg etc
      const extname = fileTypes.test(path.extname(file.originalname)); //gets the filetypes of the images uploded from user,gives the original name of the image file

      if (mimeTypes && extname) {
        return cb(null, true);
      }
      cb("Give proper files format to upload");
    },
  }).array("Image"),
  (req, res, next) => {
    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({ error: "Image is required" });
    // }
    next();
  },
];

//   const ticketValidation = [
//     body("Title", "Enter a valid title").isLength({ min: 3 }),
//     body("URL", "Enter a valid URL").isLength({ min: 5 }),
//   ];

const addticket = async (req, res) => {
  const {
    Ticket_Subject,
    // User,
    Assign_User,
    Ticket_Priority,
    // Ticket_Status,
    Department_id,
    Ticket_Body,
    Severity_id,
    Category_id,
    SubCategory_id,
  } = req.body;
  // const imageUrls = [];
  try {
    var clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // console.log(req.user.currentFiscalYear);
    const tickets = await Tickets.create({
      Ticket_Subject,
      User: req.user.Username,
      StaffId: req.user.StaffId,
      Assign_User,
      Ticket_Priority,
      Ticket_Status: "New",
      Department_id,
      Ticket_Body,
      Severity_id:
        Severity_id === "null" || Severity_id === "" ? null : Severity_id,
      Category_id,
      SubCategory_id: SubCategory_id === "null" ? null : SubCategory_id,
      SOL_id: req.user.Branch,
      FiscalYear: req.user.currentFiscalYear,
      // Ip: ip.address(),//for localhost
      Ip: clientIP, //for UAT
    });
    for (const file of req.files) {
      // const content =
      await TicketFiles.create({
        Name: file.path,
        Ticket_id: tickets.id,
      });
      // imageUrls.push(content);
    }
    const createdTicket = await Tickets.findOne({
      where: { id: tickets.id },
      include: [
        {
          model: Category,
          as: "Category",
        },
        {
          model: Branch,
          as: "branch",
        },
        {
          model: Severity,
          as: "severity",
        },
      ],
    });
    await addticketlogs({
      ticket_id: tickets.id,
      createdby: req.user.Username,
      Status: 1,
      Ticket_Status: "New",
    });
    await sendmailtm({
      //send mail to ticketmanager
      department: tickets.Department_id,
      text: `<b>Heading:</b> ${createdTicket.Category.Name}</br></br>Ticket #${tickets.id} has been created by ${tickets.User}. Please check in HelpDesk and assign the Ticket to respective user.`,
      subject: "HelpDesk Ticket Created",
    });

    if (tickets.Severity_id) {
      //if Severity_id exist
      const tableHtml = generateTableHtml({
        ticketid: tickets.id,
        sevname: createdTicket.severity.Name,
        duration: createdTicket.severity.Duration,
        remark: `Your ticket will be solved under ${createdTicket.severity.Duration} minutes.`,
      });
      await sendmail({
        text: tableHtml,
        to: `${tickets.User}@sanimabank.com`,
        // cc: `bipul.bajracharya@sanimabank.com`,
        subject: "HelpDesk",
      });
    }

    res.status(200).json(createdTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//assign user (Ticket Manager)
const assignuser = [
  assignuserValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { assignuserid } = req.body;
    try {
      const data = await Tickets.findOne({
        where: { id: req.params.id },
      });
      const content = await axios.get(
        `http://192.168.1.52:8090/api/staff/${assignuserid}`
      );
      if (data) {
        if (data.User === assignuser) {
          res.status(401).json({
            message: "Cannot assign ticket to the ticket created user",
          });
        } else {
          if (data.Department_id == req.user.DeptId) {
            //ticketmanager should be of same department as of ticket department
            data.Assign_User_Id = assignuserid;
            data.Assign_User = content.data.username;
            data.Ticket_Status = "In Progress";
            await data.save();

            const logsdata = await addticketlogs({
              ticket_id: req.params.id,
              assignto: content.data.username,
              createdby: req.user.Username,
              Status: 2,
              Ticket_Status: data.Ticket_Status,
            });

            await sendmail({
              text: `Ticket #${data.id} has been assigned to ${content.data.username}.Please check in HelpDesk.`,
              to: `${content.data.username}@sanimabank.com`,
              // cc: `bipul.bajracharya@sanimabank.com`,
              subject: "HelpDesk",
            });

            await data.reload({
              attributes: {
                include: [
                  [
                    // Note the wrapping parentheses in the call below!
                    Sequelize.literal(`(
                            SELECT SUM(CAST(Time_Diff AS BIGINT))
                            FROM TicketLogs AS TicketLogs
                            WHERE
                            TicketLogs.ticket_id = ${req.params.id}
                        )`),
                    "total_worked",
                  ],
                ],
              },
            });
            res.status(200).json({ data, logsdata });
          } else {
            res.status(401).json({ message: "TM Unauthorized" });
          }
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const acknowledgeuser = [
  acknowledgeuserValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { acknowledgeuser } = req.body;
    try {
      const data = await Tickets.findOne({
        where: { id: req.params.id },
      });
      if (data) {
        if (data.Department_id == req.user.DeptId) {
          //ticketmanager should be of same department as of ticket department
          data.Is_Acknowledge = 1;
          data.Acknowledge_User = acknowledgeuser;
          await data.save();

          const logsdata = await addticketlogs({
            ticket_id: req.params.id,
            assignto: acknowledgeuser,
            createdby: req.user.Username,
            Status: 7,
            Ticket_Status: data.Ticket_Status,
          });

          await sendmail({
            text: `Ticket #${data.id} has been sent for acknowledgement.Please check in HelpDesk.`,
            to: `${acknowledgeuser}@sanimabank.com`,
            cc: `bipul.bajracharya@sanimabank.com`,
            subject: "HelpDesk",
          });

          await data.reload({
            attributes: {
              include: [
                [
                  // Note the wrapping parentheses in the call below!
                  Sequelize.literal(`(
                            SELECT SUM(CAST(Time_Diff AS BIGINT))
                            FROM TicketLogs AS TicketLogs
                            WHERE
                            TicketLogs.ticket_id = ${req.params.id}
                        )`),
                  "total_worked",
                ],
              ],
            },
          });
          res.status(200).json({ data, logsdata });
        } else {
          res.status(401).json({ message: "TM Unauthorized" });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

//assignuserself(self)
const assignuserself = [
  assignuserValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { assignuserid } = req.body;
    try {
      const data = await Tickets.findOne({
        where: { id: req.params.id },
      });
      const content = await axios.get(
        `http://192.168.1.52:8090/api/staff/${assignuserid}`
      );
      if (data) {
        if (data.User === assignuser) {
          res.status(401).json({
            message: "Cannot assign ticket to the ticket created user",
          });
        } else {
          if (data.Department_id == req.user.DeptId) {
            //ticketmanager should be of same department as of ticket department and assignuser should be null for self assign
            if (data.Assign_User === "") {
              data.Assign_User_Id = assignuserid;
              data.Assign_User = content.data.username;
              data.Ticket_Status = "In Progress";
              await data.save();

              const logsdata = await addticketlogs({
                ticket_id: req.params.id,
                assignto: content.data.username,
                createdby: req.user.Username,
                Status: 2,
                Ticket_Status: data.Ticket_Status,
              });
              await data.reload({
                attributes: {
                  include: [
                    [
                      // Note the wrapping parentheses in the call below!
                      Sequelize.literal(`(
                            SELECT SUM(CAST(Time_Diff AS BIGINT))
                            FROM TicketLogs AS TicketLogs
                            WHERE
                            TicketLogs.ticket_id = ${req.params.id}
                        )`),
                      "total_worked",
                    ],
                  ],
                },
              });
              res.status(200).json({ data, logsdata });
            } else {
              res.status(401).json({ message: "User already Assigned" });
            }
          } else {
            res.status(401).json({ message: "Dept not valid" });
          }
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const changestatus = [
  statuschangeValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { status } = req.body;
    try {
      const data = await Tickets.findOne({
        where: { id: req.params.id },
      });
      if (data) {
        if (data.Department_id == req.user.DeptId) {
          data.Ticket_Status = status;
          await data.save();
          const logsdata = await addticketlogs({
            ticket_id: req.params.id,
            assignto: data.Assign_User,
            createdby: req.user.Username,
            Status: 4,
            Ticket_Status: status,
          });
          await sendmail({
            text: `Ticket status has been changed to ${status} by ${data.Assign_User} of Ticket id #${data.id}.Please check in HelpDesk.`,
            to: `${data.User}@sanimabank.com`,
            subject: "HelpDesk",
          });

          await data.reload({
            attributes: {
              include: [
                [
                  // Note the wrapping parentheses in the call below!
                  Sequelize.literal(`(
                        SELECT SUM(CAST(Time_Diff AS BIGINT))
                        FROM TicketLogs AS TicketLogs
                        WHERE
                        TicketLogs.ticket_id = ${req.params.id}
                    )`),
                  "total_worked",
                ],
              ],
            },
          });

          res.status(200).json({ data, logsdata });
        } else {
          res.status(401).json({ message: "TM Unauthorized" });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const changeseverity = [
  severitychangeValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { severity } = req.body;
    try {
      const data = await Tickets.findOne({
        where: { id: req.params.id },
      });
      if (data) {
        if (data.Department_id == req.user.DeptId) {
          data.Severity_id = severity;
          await data.save();
          const logsdata = await addticketlogs({
            ticket_id: req.params.id,
            assignto: data.Assign_User,
            createdby: req.user.Username,
            Status: 6,
            Severity_id: severity,
            Ticket_Status: data.Ticket_Status,
          });

          await data.reload({
            attributes: {
              include: [
                [
                  // Note the wrapping parentheses in the call below!
                  Sequelize.literal(`(
                        SELECT SUM(CAST(Time_Diff AS BIGINT))
                        FROM TicketLogs AS TicketLogs
                        WHERE
                        TicketLogs.ticket_id = ${req.params.id}
                    )`),
                  "total_worked",
                ],
              ],
            },
            include: [
              {
                model: Severity,
                as: "severity",
              },
            ],
          });
          await logsdata.reload({
            include: [
              {
                model: Severity,
                as: "severities",
              },
            ],
          });

          const tableHtml = generateTableHtml({
            ticketid: data.id,
            sevname: data.severity.Name,
            duration: data.severity.Duration,
            remark: `Your ticket will be solved under ${data.severity.Duration} minutes.`,
          });
          await sendmail({
            text: tableHtml,
            to: `${data.User}@sanimabank.com`,
            cc: `bipul.bajracharya@sanimabank.com`,
            subject: "HelpDesk",
          });

          res.status(200).json({ data, logsdata });
        } else {
          res.status(401).json({ message: "TM Unauthorized" });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

//get all tickets
const getTicket = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10;
  try {
    // console.log(typeof req.accesstodept.split(","));
    const totalCount = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

    const offset = (page - 1) * limit;
    const data = await Tickets.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: Category,
          as: "Category",
        },
        {
          model: Branch,
          as: "branch",
        },
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") }, //req.user.DeptName, // Assuming 'Name' is the property in the 'Department' model you want to filter on
          },
        },
        {
          model: Ticketreplies,
          as: "ticketreply",
        },
      ],
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

//ticket created by you
const getUserTicket = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; //Infinity we can write Infinity instead of 10
  const { search, fiscalyear } = req.body;
  try {
    const options = {
      where: {
        [Op.and]: [{ User: req.user.Username }],
      },
    };
    if (search) {
      options.where[Op.and].push({
        [Op.or]: [
          { Ticket_Subject: { [Op.like]: `%${search}%` } },
          { User: { [Op.like]: `%${search}%` } },
          { Assign_User: { [Op.like]: `%${search}%` } },
          { id: { [Op.like]: `%${search}%` } },
          { Category_id: { [Op.like]: `%${search}%` } },
        ],
      });
    }
    if (fiscalyear) {
      options.where[Op.and].push({ FiscalYear: fiscalyear });
    }

    const totalCount = await Tickets.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
    const offset = (page - 1) * limit;

    const ticketoptions = {
      where: {
        [Op.and]: [{ User: req.user.Username }],
      },
      include: [
        {
          model: Category,
          as: "Category",
        },
        {
          model: Branch,
          as: "branch",
        },
        {
          model: Department,
          as: "departments",
        },
        {
          model: Ticketreplies,
          as: "ticketreply",
        },
      ],
    };

    if (search) {
      ticketoptions.where[Op.and].push({
        [Op.or]: [
          { Ticket_Subject: { [Op.like]: `%${search}%` } },
          { User: { [Op.like]: `%${search}%` } },
          { Assign_User: { [Op.like]: `%${search}%` } },
          { id: { [Op.like]: `%${search}%` } },
        ],
      });
    }
    if (fiscalyear) {
      ticketoptions.where[Op.and].push({ FiscalYear: fiscalyear });
    }

    // console.log(ticketoptions)
    const data = await Tickets.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      where: ticketoptions.where, // Spreading the "where" condition
      include: ticketoptions.include,
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

//view Ticket
const getspecificTicket = async (req, res) => {
  try {
    const data = await Tickets.findOne({
      attributes: {
        include: [
          [
            // Note the wrapping parentheses in the call below!
            Sequelize.literal(`(
                    SELECT SUM(CAST(Time_Diff AS BIGINT))
                    FROM TicketLogs AS TicketLogs
                    WHERE
                    TicketLogs.ticket_id = ${req.params.id}
                )`),
            "total_worked",
          ],
        ],
      },
      //   attributes: [
      //     [Sequelize.fn('SUM', Sequelize.col('ticketlogs.Time_Diff')), 'total_time'],id,
      //  ],
      include: [
        {
          model: Category,
          as: "Category",
        },
        {
          model: TicketFiles,
          as: "Ticketimages",
        },
        {
          model: Severity,
          as: "severity",
        },
        {
          model: SubCategory,
          as: "SubCategory",
        },
        {
          model: Ticketlogs,
          as: "ticketlogs",
          include: [
            {
              model: Department,
              as: "departments",
            },
            {
              model: Severity,
              as: "severities",
            },
            {
              model: Category,
              as: "categories",
            },
            {
              model: SubCategory,
              as: "subcategories",
            },
          ],
        },
        {
          model: Department,
          as: "departments",
        },
      ],
      where: { id: req.params.id },
    });

    // console.log(data.ticket_logs)

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getDepartment = async (req, res) => {
  try {
    const data = await Department.findAll({});
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

// const sendmailtm = async ({ department, text, subject, cc }) => {
const sendmailtm = async ({ department, text, subject, cc }) => {
  //send mail to ticketmanager of specific department
  try {
    const userdata = await Users.findAll({
      where: { DeptId: department, role_id: 2 },
    });
    if (userdata) {
      for (const x of userdata) {
        //send mail to all ticketmanager of respective department
        await axios.post(process.env.REACT_APP_SEND_MAIL, {
          body: text,
          to: x.Email,
          subject: subject,
          cc,
        });
        // console.log(data)
      }
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: error.message });
  }
};

const sendmail = async ({ text, to, subject, cc }) => {
  //send mail to ticket assigned user
  try {
    // console.log(to);
    await axios.post(process.env.REACT_APP_SEND_MAIL, {
      body: text,
      to,
      subject,
      cc,
    });
    // console.log(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const addticketlogs = async ({
  ticket_id,
  createdby,
  assignto,
  Status,
  reply_id,
  Ticket_Status,
  Severity_id,
  department,
  Category_id,
  SubCategory_id,
}) => {
  try {
    let Time_Diff = 0;
    const logRecords = await Ticketlogs.findAll({
      where: { ticket_id: ticket_id },
    });
    if (logRecords.length > 0) {
      const currentDate = new Date();
      Time_Diff = currentDate - logRecords[logRecords.length - 1].updatedAt; //logReords.length - 1 for getting the last updatedtime
    }
    const data = await Ticketlogs.create({
      ticket_id: ticket_id,
      Created_By: createdby,
      Assigned_to: assignto,
      Status: Status,
      reply_id,
      Ticket_Status,
      Department_id: department,
      Time_Diff,
      Severity_id,
      Category_id,
      SubCategory_id,
    });
    return data;
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: error.message });
  }
};

const addreply = [
  ticketreplyValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { Replies, ticket_id } = req.body;
    try {
      const data = await Ticketreplies.create({
        Replied_By: req.user.Username,
        Replies,
        treply_id: ticket_id,
      });
      if (req.files) {
        for (const file of req.files) {
          await ReplyFiles.create({
            //adding files in replyfiles table
            Name: file.path,
            Reply_id: data.id,
          });
        }
      }
      const replydata = await Ticketreplies.findOne({
        where: { id: data.id },
        include: [
          {
            model: ReplyFiles,
            as: "Ticketfiles",
          },
        ],
      });
      if (data) {
        const logsdata = await addticketlogs({
          ticket_id,
          createdby: req.user.Username,
          Status: 3,
          reply_id: data.id,
        });
        const ticketdata = await Tickets.findOne({
          where: { id: ticket_id },
        });
        if (ticketdata) {
          if (ticketdata.User !== req.user.Username) {
            ticketdata.Ticket_Status = "In Progress";
            await ticketdata.save();
          }
          if (ticketdata.User === req.user.Username) {
            if (ticketdata.Assign_User) {
              await sendmail({
                text: `Ticket created User ${ticketdata.User} has reply to Ticket #${ticket_id}.Please check in HelpDesk.`,
                to: `${ticketdata.Assign_User}@sanimabank.com`,
                cc: `bipul.bajracharya@sanimabank.com`,
                subject: "HelpDesk",
              });
            }
          } else if (ticketdata.Assign_User === req.user.Username) {
            await sendmail({
              text: `Assign User ${ticketdata.Assign_User} has reply to Ticket #${ticket_id}.Please check in HelpDesk.`,
              to: `${ticketdata.User}@sanimabank.com`,
              cc: `bipul.bajracharya@sanimabank.com`,
              subject: "HelpDesk",
            });
          }
        }
        await replydata.reload({
          attributes: {
            include: [
              [
                // Note the wrapping parentheses in the call below!
                Sequelize.literal(`(
                        SELECT SUM(CAST(Time_Diff AS BIGINT))
                        FROM TicketLogs AS TicketLogs
                        WHERE
                        TicketLogs.ticket_id = ${ticket_id}
                    )`),
                "total_worked",
              ],
            ],
          },
          // include: [
          //   {
          //     model: Ticketlogs,
          //     as: "ticketlogs",
          //   },
          // ],
        });
        // console.log(data);
        res
          .status(200)
          .send({ reply: replydata, ticket: ticketdata, logsdata });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  },
];

const getReply = async (req, res) => {
  try {
    const data = await Ticketreplies.findAll({
      where: { treply_id: req.params.id },
      include: [
        {
          model: ReplyFiles,
          as: "Ticketfiles",
        },
      ],
    });
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const switchDepartment = [
  switchdepartmentValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { department } = req.body;
    try {
      const data = await Tickets.findOne({
        where: { id: req.params.id },
      });
      if (data) {
        if (data.Department_id == req.user.DeptId) {
          data.Department_id = department;
          data.Assign_User = "";
          data.Ticket_Status = "New";
          await data.save();
          const logsdata = await addticketlogs({
            ticket_id: req.params.id,
            assignto: data.Assign_User,
            createdby: req.user.Username,
            Status: 5,
            Ticket_Status: data.Status,
            department: department,
          });

          await data.reload({
            attributes: {
              include: [
                [
                  // Note the wrapping parentheses in the call below!
                  Sequelize.literal(`(
                          SELECT SUM(CAST(Time_Diff AS BIGINT))
                          FROM TicketLogs AS TicketLogs
                          WHERE
                          TicketLogs.ticket_id = ${req.params.id}
                      )`),
                  "total_worked",
                ],
              ],
            },
            include: [
              {
                model: Department,
                as: "departments",
              },
              {
                model: Category,
                as: "Category",
              },
            ],
          });
          await logsdata.reload({
            include: [
              {
                model: Department,
                as: "departments",
              },
            ],
          });

          await sendmail({
            text: `<b>Heading:</b> ${data.Category.Name}</br></br>Ticket #${data.id} has been switched to ${data.departments.Name}. Please check in HelpDesk and assign the Ticket to respective user.`,
            // to: `${data.departments.Email}`,
            subject: "HelpDesk Ticket Switched",
          });

          res.status(200).json({ data, logsdata });
        } else {
          res.status(401).json({ message: "TM Unauthorized" });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const getassignedTicket = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { category, search, fiscalyear, status } = req.body;
  try {
    const options = {
      where: {
        [Op.and]: [{ Assign_User: req.user.Username }],
      },
      include: [
        {
          model: Category,
          as: "Category",
        },
        {
          model: Branch,
          as: "branch",
        },
        {
          model: Department,
          as: "departments",
        },
        {
          model: Ticketreplies,
          as: "ticketreply",
        },
      ],
    };
    if (category) {
      options.where[Op.and].push({ Category_id: category });
    }
    if (search) {
      options.where[Op.and].push({
        [Op.or]: [
          { Ticket_Subject: { [Op.like]: `%${search}%` } },
          { User: { [Op.like]: `%${search}%` } },
          { Assign_User: { [Op.like]: `%${search}%` } },
          { id: { [Op.like]: `%${search}%` } },
        ],
      });
    }
    if (status) {
      options.where[Op.and].push({ Ticket_Status: status });
    }
    if (fiscalyear) {
      options.where[Op.and].push({ FiscalYear: fiscalyear });
    }

    const totalCount = await Tickets.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
    const offset = (page - 1) * limit;

    const data = await Tickets.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      where: options.where,
      include: options.include,
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const getacknowledgeTicket = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { search } = req.body;
  try {
    const options = {
      where: {
        [Op.and]: [
          { Is_Acknowledge: 1 },
          { Acknowledge_User: req.user.Username },
        ],
      },
      include: [
        {
          model: Category,
          as: "Category",
        },
        {
          model: Branch,
          as: "branch",
        },
        {
          model: Department,
          as: "departments",
        },
      ],
    };

    if (search) {
      options.where[Op.and].push({
        [Op.or]: [
          { Ticket_Subject: { [Op.like]: `%${search}%` } },
          { User: { [Op.like]: `%${search}%` } },
          { Assign_User: { [Op.like]: `%${search}%` } },
          { id: { [Op.like]: `%${search}%` } },
        ],
      });
    }
    const totalCount = await Tickets.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
    const offset = (page - 1) * limit;

    const data = await Tickets.findAll({
      order: [["id", "DESC"]],
      limit,
      offset,
      where: options.where,
      include: options.include,
    });
    res.status(200).json({ currentPage: page, totalPages, totalCount, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const updateUserDetail = async (req, res) => {
  const { username, staffid } = req.body;
  try {
    const data = await Tickets.findOne({ where: { id: req.params.id } });
    if (data) {
      data.User = username;
      data.StaffId = staffid;
      await data.save();

      const logsdata = await addticketlogs({
        ticket_id: req.params.id,
        createdby: req.user.Username,
        Status: 8,
        Ticket_Status: data.Ticket_Status,
      });

      await data.reload({
        attributes: {
          include: [
            [
              // Note the wrapping parentheses in the call below!
              Sequelize.literal(`(
                        SELECT SUM(CAST(Time_Diff AS BIGINT))
                        FROM TicketLogs AS TicketLogs
                        WHERE
                        TicketLogs.ticket_id = ${req.params.id}
                    )`),
              "total_worked",
            ],
          ],
        },
      });
      res.status(200).json({ data, logsdata });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const countTickets = async (req, res) => {
  try {
    const allTickets = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
    });

    const newTickets = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
      where: { Ticket_Status: "New" },
    });

    const pendingTickets = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
      where: { Ticket_Status: "In Progress" },
    });

    const closedTickets = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
      where: { Ticket_Status: "Closed" },
    });
    const ticketassignedtoyou = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
      where: { Assign_User: req.user.Username },
    });
    const assignedTickets = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
      where: {
        Assign_user: { [Sequelize.Op.not]: "" },
      },
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0); //We create a today variable to store the current date with the time set to midnight (00:00:00:000).
    const todayTickets = await Tickets.count({
      include: [
        {
          model: Department,
          as: "departments",
          where: {
            DEPT_ID: { [Sequelize.Op.in]: req.accesstodept.split(",") },
          },
        },
      ],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: today,
        },
      },
    });

    res.status(200).json({
      allTickets,
      newTickets,
      pendingTickets,
      closedTickets,
      ticketassignedtoyou,
      assignedTickets,
      todayTickets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getresponseticket = async (req, res) => {
  try {
    const data = await Predefined.findAll({
      where: {
        Department_id: req.user.DeptId,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const changecategory = [
  categorychangeValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { category, subcategory } = req.body;
    try {
      const data = await Tickets.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (data) {
        if (data.Department_id == req.user.DeptId) {
          data.Category_id = category;
          data.SubCategory_id = subcategory;
          data.Ticket_Status = "In Progress";
          await data.save();
          const logsdata = await addticketlogs({
            ticket_id: req.params.id,
            assignto: data.Assign_User,
            createdby: req.user.Username,
            Status: 9,
            Category_id: category || data.Category_id,
            SubCategory_id: subcategory || data.SubCategory_id,
            Ticket_Status: data.Ticket_Status,
          });
          await data.reload({
            attributes: {
              include: [
                [
                  Sequelize.literal(`(
                        SELECT SUM(CAST(Time_Diff AS BIGINT))
                        FROM TicketLogs AS TicketLogs
                        WHERE
                        TicketLogs.ticket_id = ${req.params.id}
                    )`),
                  "total_worked",
                ],
              ],
            },
            include: [
              {
                model: Category,
                as: "Category",
              },
              {
                model: SubCategory,
                as: "SubCategory",
              },
            ],
          });
          await logsdata.reload({
            include: [
              {
                model: Category,
                as: "categories",
              },
              {
                model: SubCategory,
                as: "subcategories",
              },
            ],
          });
          res.status(200).json({ data, logsdata });
        } else {
          res.status(401).json({ message: "TM Unauthorized" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

module.exports = {
  upload,
  addticket,
  getTicket,
  getspecificTicket,
  getDepartment,
  addticketlogs,
  assignuser,
  assignuserself,
  addreply,
  getReply,
  changestatus,
  getUserTicket,
  getassignedTicket,
  switchDepartment,
  countTickets,
  getresponseticket,
  changeseverity,
  acknowledgeuser,
  getacknowledgeTicket,
  updateUserDetail,
  changecategory,
};
