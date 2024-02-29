import React from "react";


// import {
//   isAllowedToDepartment,
//   isAllowedToBranch
// } from './services/RoutingMiddleware';

const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'));
const FAQ = React.lazy(()=>import('./views/pages/FAQ/FAQ'));
const Branch = React.lazy(() => import("./views/pages/Admin/Branches"));
const AddTicket = React.lazy(() => import("./views/pages/Tickets/AddTicket"));
const UserTicket = React.lazy(() => import("./views/pages/Tickets/UserTicket"));
const AccessControl = React.lazy(()=>import("./views/pages/AccessControl/AccessControl"));
const AssignTicket = React.lazy(() =>
  import("./views/pages/Tickets/AssignTicket")
);
const AcknowledgeTicket = React.lazy(()=>import("./views/pages/Tickets/TicketAcknowledge"));
const Tickets = React.lazy(() => import("./views/pages/Tickets/Tickets"));
const ViewTicket = React.lazy(() =>
  import("./views/pages/Tickets/ViewTicket/ViewTicket")
);
const Category = React.lazy(() => import("./views/pages/Category/Categories"));
const SubCategory = React.lazy(() =>
  import("./views/pages/SubCategory/SubCategory")
);
const Members = React.lazy(() => import("./views/pages/Admin/Members/Members"));
const UserRoles = React.lazy(() =>
  import("./views/pages/Admin/Userroles/Userroles")
);
const Ticketsolvebystaff = React.lazy(()=>import("./views/pages/Admin/Reports/Ticketsolvedbystaff"));
const Ticketcategorysolved = React.lazy(()=>import("./views/pages/Admin/Reports/TicketCategorySolved"));
const PredefinedResponse = React.lazy(()=>import("./views/pages/Admin/Predefined/PredefinedResponse"));
const EODNotice = React.lazy(()=>import("./views/pages/Admin/EOD/Notice"));
const Severity = React.lazy(()=>import("./views/pages/Severity/Severity"));
const Profile = React.lazy(() => import("./views/pages/profile/Profile"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page401 = React.lazy(() => import("./views/pages/page401/Page401"));
const FaqAdmin = React.lazy(()=>import("./views/pages/TicketManager/Faq/Faq"));
const ManualAdmin = React.lazy(()=>import("./views/pages/TicketManager/Manuals/Manual"));
const LinkAdmin = React.lazy(()=>import("./views/pages/TicketManager/Links/Link"));
const Manuals = React.lazy(()=>import("./views/pages/Manuals/Manuals"));
const Link = React.lazy(()=>import("./views/pages/Links/Link"));
const Report = React.lazy(()=>import("./views/pages/Admin/Reports/HrReport"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/profile", name: "Profile", component: Profile },
  {path: "/dashboard", name: "Dashboard", component: Dashboard },
  {path:"/faq",name:"FAQ",component:FAQ},
  {path:"/manuals",name:"Manual",component:Manuals},
  {path:"/importantlink",name:"Link",component:Link},
  {
    path: "/tickets",
    exact: true,
    name: "Tickets / All Tickets",
    component: Tickets,
  },
  { path: "/addticket", exact: true, name: "Ticket", component: AddTicket },
  {
    path: "/userticket",
    exact: true,
    name: "Tickets / Ticket Created By You",
    component: UserTicket,
  },
  {
    path: "/assignticket",
    exact: true,
    name: "Tickets / Tickets Assigned To You",
    component: AssignTicket,
  },
  {
    path: "/acknowledgeticket",
    exact: true,
    name: "Tickets / Tickets Acknowledged To You",
    component: AcknowledgeTicket,
  },
  {
    path: "/viewticket/:ticketId",
    exact: true,
    name: "ViewTicket",
    component: ViewTicket,
  },
  { path: "/category", exact: true, name: "Category / Main Category", component: Category },
  {
    path: "/subcategory",
    exact: true,
    name: "Category / SubCategory",
    component: SubCategory,
  },
  {
    path: "/page-not-found",
    exact: true,
    name: "Page not found",
    component: Page404,
  },
  { path: "/branches", exact: true, name: "Admin / Branch", component: Branch },
  { path: "/members", exact: true, name: "Admin / User", component: Members },
  { path: "/userroles", exact: true, name: "Admin / Roles", component: UserRoles },
  { path:"/eodnotice",exact:true,name:"EOD / Notice",component:EODNotice },
  { path: "/accesscontrol", exact: true, name: "Admin / AccessControl", component: AccessControl },
  { path: "/predefinedresponse", exact: true, name: "Admin / PredefinedResponse", component: PredefinedResponse },
  {path:"/ticketsolvebystaff",exact:true,name:"Reports / Ticketsolvebystaff",component:Ticketsolvebystaff},
  {path:"/ticketcategorysolve",exact:true,name:"Reports / Tickets Category Solved",component:Ticketcategorysolved},
  {path:"/severity",exact:true,name:"Ticket Manager / Severity",component:Severity},
  {path:"/faqadmin",exact:true,name:"Ticket Manager / Faq",component:FaqAdmin},
  {path:"/manualadmin",exact:true,name:"Ticket Manager / Manual",component:ManualAdmin},
  {path:"/linkadmin",exact:true,name:"Ticket Manager / Links",component:LinkAdmin},
  {path:"/reporthr",name:"Ticket Manager / Report",component:Report},
  {
    path: "/not-authorized",
    exact: true,
    name: "Unauthorized",
    component: Page401,
  },
];

export default routes;
