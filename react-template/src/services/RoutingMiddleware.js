import { decodeToken } from "react-jwt";

const decodedToken = decodeToken(localStorage.getItem('token'));
const data = decodedToken.data.recordset[0];

export const isAllowedToDepartment = () => {
    const departmentId = data.DeptId;
    if(departmentId === '67')
        return true;
    else
        return false;
}

export const isAllowedToBranch = () => {
    const branchId = data.Branch;
    if(branchId === '1')
        return true;
    else
        return false;
}