const { body, oneOf } = require("express-validator");

const assignuserValidation = [
  body("assignuserid", "Enter a valid user ID").isLength({ min: 1 }),
];

const acknowledgeuserValidation = [
  body("acknowledgeuser","Enter a valid acknowledgeuser").isLength({min:1}),
]

const statuschangeValidation = [
  body("status", "Enter a valid status").isLength({ min: 1 }),
];

const severitychangeValidation = [
  body("severity","Enter a valid severity").isLength({min:1}),
]

const categorychangeValidation = oneOf([
  body("category","Category is required").isLength({min:1}),
  body("subcategory","SubCategory is required").isLength({min:1})
]);

const ticketreplyValidation = [
  body("Replies", "Replies is compulsory").isLength({ min: 1 }),
  body("ticket_id", "Ticketid is compulsory").isLength({ min: 1 }),
];

const addroleValidation = [
  body("rolename", "rolename is invalid").isLength({ min: 2 }),
];

const addmemberValidation = [
  body("StaffId", "StaffId is required").isLength({ min: 1 }),
  body("role", "Role is required").isLength({ min: 1 }),
];

const switchdepartmentValidation = [
  body("department", "Department is required").isLength({ min: 1 }),
];

const filterticketValidation = oneOf([
  body("category","Category is required").isLength({ min:1 }),
  body("search","Search is required").isLength({ min:1 }),
  body("status","Status is required").isLength({ min:1 }),
  body("fiscalyear","FiscalYear is required").isLength({ min:1 }),
  body("department","Department is required").isLength({min:1})
]);

const predefinedValidation = [
  body("department","Dept is required").isLength({min:1}),
  body("prereply","Prereply is required").isLength({min:1}),
];

const eodnoticevalidation = [
  body("Content","Content is required").isLength({min:1})
]

const addseverityvalidation = [
  body("name","Name is required").isLength({min:1}),
  body("duration","Duration is required").isLength({min:1})
]

const faqvalidation = [
  body("question","Question is required").isLength({min:1}),
  body("answer","Answer is required").isLength({min:1})
]

const manualvalidation = [
  body("manualfilename","Manual File Name is required").isLength({min:1})
]

const linkvalidation = [
  body("appname","Video Name is required").isLength({min:1}),
  body("link","Video Link is required").isLength({min:1})
]

const reportvalidation = [
  body("fiscalyear","Fiscal Year is required").isLength({min:1}),
  body("status","Status is required").isLength({min:1})
]

module.exports = {
  assignuserValidation,
  ticketreplyValidation,
  addroleValidation,
  addmemberValidation,
  statuschangeValidation,
  switchdepartmentValidation,
  filterticketValidation,
  predefinedValidation,
  eodnoticevalidation,
  addseverityvalidation,
  severitychangeValidation,
  acknowledgeuserValidation,
  faqvalidation,
  manualvalidation,
  linkvalidation,
  reportvalidation,
  categorychangeValidation
};
