//import { decodeToken} from "react-jwt";


// var token = localStorage.getItem('token');
// const decodedToken = decodeToken(token);
// var decodedData = decodedToken.data.recordset[0];
// var departmentId = decodedData.DeptId;


// var temporaryRoutes = {
//     67: ['/customers', '/theme/colors'],
// };

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'info',
    },
    show: true
  },
  {
    _tag: 'CSidebarNavTitle',
    name: 'Theme',
    show: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Customers',
    to: '/customers',
    icon: 'cil-user',
    show: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Customers',
    to: '/customers',
    icon: 'cil-user',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Colors',
    to: '/theme/colors',
    icon: 'cil-drop',
    show: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Typography',
    to: '/theme/typography',
    icon: 'cil-pencil',
    show: true
  },
  {
    _tag: 'CSidebarNavTitle',
    name: 'Components',
    show: true
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Buttons',
    route: '/buttons',
    icon: 'cil-cursor',
    show: true,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons',
        to: '/buttons/buttons',
        show: true
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Brand buttons',
        to: '/buttons/brand-buttons',
        show: true
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons groups',
        to: '/buttons/button-groups',
        show: true
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Dropdowns',
        to: '/buttons/button-dropdowns',
        show: true
      }
    ],
  },
]

// export const IsAllowed = (recievedPath) => {
// 	var path = recievedPath; 
//   var disabledRoutes = temporaryRoutes[departmentId];
//   return !(disabledRoutes.indexOf(path) >= 0);
// }

// _nav.forEach((links, key) => {
//   var disabledRoutes = temporaryRoutes[departmentId];
//   if(disabledRoutes.indexOf(links.to) >= 0){
//     links.show = false
//   }
// });

export default _nav