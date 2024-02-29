var db = require("../models");
const { validationResult } = require("express-validator");
var Severity = db.severity;
var Tickets = db.tickets;
var Users = db.users;
var Department = db.departments;
const { addseverityvalidation } = require("../validations/validation");
const { Op } = require("sequelize");
const axios = require("axios");
var cron = require("node-cron");

const addSeverity = [
  addseverityvalidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, duration } = req.body;
    try {
      const data = await Severity.create({
        Name: name,
        Duration: duration,
        CreatedBy: req.user.Username,
      });
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const updateSeverity = async (req, res) => {
  const { name, duration } = req.body;
  try {
    const data = await Severity.findOne({
      where: { id: req.params.id },
    });
    if (data) {
      data.Name = name;
      data.Duration = duration;
      data.CreatedBy = req.user.Username;
      await data.save();
      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteSeverity = async (req, res) => {
  try {
    const [updatedRowCount] = await Severity.update(
      {
        DeletedBy: req.user.Username,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedRowCount > 0) {
      const data = await Severity.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ data: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getSeverity = async (req, res) => {
  try {
    const data = await Severity.findAll({});
    res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
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
    // res.status(500).json({ message: error.message });
  }
};

const generateTableHtml = ({ ticketid, sevname, duration, remark }) => {
  return `
    <table border="1">
      <thead>
        <tr>
          <th>Ticket ID</th>
          <th>Severity Name</th>
          <th>Severity Response Time</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>
          <tr>
            <td style="text-align: center">${ticketid}</td>
            <td style="text-align: center">${sevname}</td>
            <td style="text-align: center">${duration}</td>
            <td>${remark}</td>
          </tr>
      </tbody>
    </table>
  `;
};

const checkSeverity = async () => {
  try {
    const currentDate = new Date();
    const data = await Tickets.findAll({
      where: {
        Ticket_Status: {
          [Op.not]: "Closed",
        },
      },
      include: [
        {
          model: Severity,
          as: "severity",
        },
        {
          model: Department,
          as: "departments",
        },
      ],
    });
    for (const element of data) {
      const tm = await Users.findOne({
        where: {
          DeptId: element.Department_id,
          category_id: element.Category_id,
        },
        include: [
          {
            model: Department,
            as: "department",
          },
        ],
      });
      const timediff = currentDate - element.updatedAt;
      const minutesDiff = Math.floor(timediff / (1000 * 60)); // Convert milliseconds to minutes
      // console.log(element.Severity_id);
      if (element.Severity_id) {
        // console.log(minutesDiff + ">" + element.severity.Duration);
        // console.log(minutesDiff + ">" + element.severity.Duration * 2);
        if (minutesDiff > element.severity.Duration) {
          const tableHtml = generateTableHtml({
            ticketid: element.id,
            sevname: element.severity.Name,
            duration: element.severity.Duration,
            remark: `Ticket ${element.id} has cross the severity time limit. Please response to it`,
          });
          if (element.Assign_User) {
            //if there is assignuser send mail to assigned user,ticketmanager and first supervisor
            const content = await axios.get(
              `http://192.168.1.52:8090/api/staff/${element.Assign_User_Id}`
            );
            // console.log("first supervisor mail");
            await sendmail({
              text: tableHtml,
              to: `${content.data.email},${tm && tm.Email},${
                content.data.supervisor.email
              }`,
              cc: `bipul.bajracharya@sanimabank.com`,
              subject: "HelpDesk",
            });

            if (minutesDiff > element.severity.Duration * 2) {
              //for sending mail to second supervisor(if the ticket doesnt get responds again)
              const secondcontent = await axios.get(
                `http://192.168.1.52:8090/api/staff/${content.data.supervisor.staffId}`
              );
              await sendmail({
                text: tableHtml,
                to: `${secondcontent.data.supervisor.email},${
                  tm && tm.department.Email
                }`,
                cc: `bipul.bajracharya@sanimabank.com`,
                subject: "HelpDesk",
              });
            }
          } else {
            //if no assignuser send mail to respective dept
            await sendmail({
              text: tableHtml,
              to: `${element.department.Email}`,
              cc: `bipul.bajracharya@sanimabank.com`,
              subject: "HelpDesk",
            });
          }
        }
      }
    }
    // res.status(200).json(data);
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: error.message });
  }
};

// cron.schedule('*/1 * * * *', () => {//running as task every minute
//   console.log('running a task every 1 minute');
//   checkSeverity();
// });

module.exports = {
  addSeverity,
  updateSeverity,
  deleteSeverity,
  getSeverity,
  checkSeverity,
  generateTableHtml,
};
