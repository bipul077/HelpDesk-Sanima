const express = require('express');
const app = express.Router();
const ctrl = require('../controllers/Category');
const ticket = require('../controllers/ticket');
const admin = require('../controllers/admin');
const accesscontrol = require('../controllers/accesscontrol');
const report = require('../controllers/report');
const filterticket = require('../controllers/filterticket');
const eodnotice = require('../controllers/eodnotice');
const severity = require('../controllers/severity');
const faq = require('../controllers/faq');
const manual = require('../controllers/manual');
const link = require('../controllers/link');
const auth = require('../middlewares/auth');
const isadmin = require('../middlewares/isadmin');
const accesstodept = require('../middlewares/accesstodept');
const isticketmanager = require('../middlewares/isticketmanager');
const isticketmanagerorassignuser = require('../middlewares/isticketmanageroruser');//isticketmanager or ticketassigneduser

//category
app.post('/addimage',auth,ctrl.upload);
app.post('/addcategory',[auth,isticketmanager],ctrl.addCategory);
app.get('/getcategory',auth,ctrl.getCategory);
app.put('/updatecategory/:id',[auth,isticketmanager],ctrl.updateCategory);
app.delete('/deletecategory/:id',[auth,isticketmanager],ctrl.deleteCategory);
app.post('/getspecificcategory',auth,ctrl.getspecificcategory);
//tickets
app.get('/getallstaffs',auth,ctrl.getallstaffs);
app.post('/addticket',auth,ticket.upload,ticket.addticket);
app.get('/tickets',[auth,accesstodept],ticket.getTicket);
app.get('/tickets/:id',auth,ticket.getspecificTicket);
//filterticket
app.post('/filterticket',[auth,accesstodept],filterticket.getfilterTicket);
app.get('/filtercategoryticket',[auth,accesstodept],filterticket.filtercategoryticket);
app.get('/filterdepartmentticket',[auth,accesstodept],filterticket.filterdepartmentticket);
//getuserticket
app.post('/getuserticket',auth,ticket.getUserTicket);
//getassignuser
app.post('/getassignticket',auth,ticket.getassignedTicket);
//getacknowledgeticket
app.post('/getacknowledgeticket',auth,ticket.getacknowledgeTicket);
//ticketlogs
app.post('/addticketlogs',auth,ticket.addticketlogs);
//subcategory
app.post('/addsubcategory',[auth,isticketmanager],ctrl.addSubCategory);
app.get('/getsubcategory',auth,ctrl.getsubcategory);//subcategory component
app.delete('/deletesubcategory/:id',[auth,isticketmanager],ctrl.deleteSubCategory);
app.put('/updatesubcategory/:id',[auth,isticketmanager],ctrl.updateSubCategory);
app.get('/subcategory/:id',auth,ctrl.getspecificsubcategory);
app.get('/subcatseverity/:id',auth,ctrl.getspecificSeverity);

//departments
app.get('/departments',auth,ticket.getDepartment);
//sync branches
app.post('/branches',[auth,isadmin],admin.syncbranches);
app.get('/getbranches',[auth,isadmin],admin.getbranches);
//assign user
app.post('/assignuser/:id',[auth,isticketmanagerorassignuser],ticket.assignuser);
//acknowledgeuser
app.post('/acknowledgeuser/:id',[auth,isticketmanagerorassignuser],ticket.acknowledgeuser);
//assignselfuser
app.post('/assignselfuser/:id',auth,ticket.assignuserself);
//change status
app.post('/changestatus/:id',[auth,isticketmanagerorassignuser],ticket.changestatus);
app.post('/changeseverity/:id',[auth,isticketmanagerorassignuser],ticket.changeseverity);
app.post('/changecategory/:id',[auth,isticketmanagerorassignuser],ticket.changecategory);
//change department
app.post('/switchdepartment/:id',[auth,isticketmanager],ticket.switchDepartment);
//reply
app.post('/addreply',auth,ticket.upload,ticket.addreply);
app.get('/reply/:id',auth,ticket.getReply);
//roles
app.get('/getrole',[auth,isadmin],admin.getrole);
app.post('/addrole',[auth,isadmin],admin.addrole);
app.patch('/updaterole/:id',[auth,isadmin],admin.updaterole);
app.delete('/deleterole/:id',[auth,isadmin],admin.deleterole);
//members
app.post('/addmember',[auth,isadmin],admin.addmember);
app.get('/getmember',[auth,isadmin],admin.getmembers);//to display in members page
app.post('/specificmember',auth,admin.getspecificmember);
app.put('/updatemember/:id',[auth,isadmin],admin.updatemember);
app.delete('/deletemember/:id',[auth,isadmin],admin.deletemember);
//accesscontrol
app.post('/addaccess',[auth,isadmin],accesscontrol.addaccesscontrol);
app.get('/getaccess',[auth,isadmin],accesscontrol.getaccesscontrols);
app.delete('/deleteaccess/:id',[auth,isadmin],accesscontrol.deleteaccesscontrols);
app.put('/updateaccess/:id',[auth,isadmin],accesscontrol.updateaccesscontrols);
app.get('/specificaccess',auth,accesscontrol.specificaccesscontrol);
//verifyrole
app.get('/verifyadmin',[auth,isadmin],admin.verifyrole);
app.get('/verifytm',[auth,isticketmanager],admin.verifyrole);
//verify accessviewticket
app.get('/accessview/:id',[auth,accesstodept],filterticket.viewaccessticket);
//counttickets
app.get('/countticket',[auth,accesstodept],ticket.countTickets);
//report
app.post('/ticketsolvebystaff',[auth,isticketmanager],report.ticketssolvedbystaff);
app.post('/categorybystaff',[auth,isticketmanager],report.categorybystaff);
app.post('/report',[auth,isticketmanager],report.hrreport);
//predefined response
app.post('/addpredefined',[auth,isticketmanager],admin.addresponse);
app.get('/getpredefined',[auth,isticketmanager],admin.getresponse);
app.delete('/deletepredefined/:id',[auth,isticketmanager],admin.deleteresponse);
app.put('/updateresponse/:id',[auth,isticketmanager],admin.updateresponse);
app.get('/responseticket',auth,ticket.getresponseticket);
//eod notice
app.post('/addeodnotice',[auth,isticketmanager],eodnotice.addnotice);
app.get('/eodnotice',auth,eodnotice.getnotice);
app.delete('/deleteeodnotice/:id',[auth,isticketmanager],eodnotice.deletenotice);
//severities
app.post('/addseverity',[auth,isticketmanager],severity.addSeverity);
app.put('/updateseverity/:id',[auth,isticketmanager],severity.updateSeverity);
app.delete('/deleteseverity/:id',[auth,isticketmanager],severity.deleteSeverity);
app.get('/severity',auth,severity.getSeverity);
//severitycheck
app.get('/checkseverity',auth,severity.checkSeverity);
//updateuserdetail
app.put('/updateuser/:id',auth,ticket.updateUserDetail);
//faq
app.post('/addfaq',[auth,isticketmanager],faq.addfaq);
app.post('/faq',auth,faq.getfaq);
app.put('/updatefaq/:id',[auth,isticketmanager],faq.updatefaq);
app.delete('/deletefaq/:id',[auth,isticketmanager],faq.deletefaq);
//manual
app.post('/addmanual',[auth,isticketmanager],manual.uploadmanual,manual.addManual);
app.post('/getmanual',auth,manual.getManual);
app.put('/updatemanual/:id',[auth,isticketmanager],manual.uploadmanual,manual.updateManual);
app.delete('/deletemanual/:id',[auth,isticketmanager],manual.deleteManual);
//video
app.post('/addlink',[auth,isticketmanager],link.addLink);
app.post('/getlink',auth,link.getLink);
app.put('/updatelink/:id',[auth,isticketmanager],link.updateLink);
app.delete('/deletelink/:id',[auth,isticketmanager],link.deleteLink);


module.exports = app;