import React, { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { useSelector, useDispatch } from "react-redux";
import { getspecificmember } from "src/store/UserSlice";

import { getProfilePhoto } from '../../../services/Services';

const Profile = () => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);
    const dispatch = useDispatch();
    const { myuser } = useSelector((state) => ({
        ...state.user
      }));
    const [userData, setUserData] = useState([]);

    const getDetails = () => {
        const decodedToken = decodeToken(localStorage.getItem('token'));
        const tokenData = decodedToken.data.recordset[0]
        setUserData(tokenData)
    }

    useEffect(() => {
        getDetails();
    }, [])
    useEffect(()=>{
        dispatch(getspecificmember({StaffId:decodedToken.data.recordset[0].StaffId}));
    },[dispatch])

    return(
        <>
            <div className="card">
                <div className="card-header">
                    <strong>
                        Profile
                    </strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 text-center mb-3">
                            <img src={getProfilePhoto()} alt={userData.Name} onError={(e)=>{e.target.onerror = null; e.target.src='avatars/default-user.jpg'}} className='c-avatar-img profile-image'/>
                        </div>
                    </div>
                    
                    <table className='table table-bordered'>
                        <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{userData.Name}</td>
                        </tr>
                        <tr>
                            <th>Staff ID</th>
                            <td>{userData.StaffId}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{userData.Email}</td>
                        </tr>
                        <tr>
                            <th>Branch</th>
                            <td>{userData.BranchName} ({userData.Branch})</td>
                        </tr>
                        <tr>
                            <th>Department</th>
                            <td>{userData.DeptName}</td>
                        </tr>
                        <tr>
                            <th>HelpDesk Role</th>
                            {/* <td>{userData && allusers.find((x)=>x.StaffId===userData.StaffId)?.userroles.RoleName}</td> */}
                            <td>{myuser && myuser.userroles && myuser.userroles.RoleName || "Not Assigned"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )}


export default Profile