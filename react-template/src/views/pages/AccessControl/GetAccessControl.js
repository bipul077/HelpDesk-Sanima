import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteaccesscontrols } from "src/store/AccessSlice";
const DeleteModal = React.lazy(() => import("../Category/DeleteModal"));
const UpdateAccessControl = React.lazy(() => import("./UpdateAccessControl"));

const GetAccessControl = ({ accesscontrols, employees, department }) => {
  const dispatch = useDispatch();
  const [deleteid, setdeleteid] = useState();
  const [argstaff, setargstaff] = useState([]);
  const [argdept, setargdept] = useState([]);
  const [model, setmodel] = useState();
  const [id, setid] = useState();
  const [showUpdateMemberModal, setShowUpdateMemberModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const getStaffNameById = (staffId) => {
    const staffs = employees.find((staff) => staff.value === staffId);
    return staffs ? staffs.label : "";
  };

  const getDeptNameById = (deptid) => {
    const DeptIds = deptid.split(","); // Split the comma-separated values into an array\
    const deptNames = DeptIds.map((id) => {
      const sols = department.find(
        (branch) => branch.value === parseInt(id.trim())
      );
      return sols ? sols.label : "";
    });
    return deptNames.join(", "); // Join the department names with comma-separated values
  };

  const getMulSolNameById = (Solid) => {
    const SolIds = Solid.split(','); // Split the comma-separated values into an array
    const branchInfo = SolIds.map((id) => {
      const depts = department.find((x) => x.value === parseInt(id.trim()));
      return depts ? { label: depts.label, value: parseInt(id.trim()) } : null;
    }).filter(Boolean); // Filter out null values if any
  
    return branchInfo;
  };

  const handleCloseDeleteModal = () => setshowDeleteModal(false);
  const handleUpdateCloseModal = () => setShowUpdateMemberModal(false);
  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };

  const handleUpdateOpenModal = (name, argval, accesstodept,id) => {
    setid(id);
    setmodel(name);
    if(name==="STAFF_ID"){
      const staffname = getStaffNameById(argval);
      setargstaff({label:staffname,value:argval});
    }
    else if(name==="JOB_ID"){
      setargstaff(argval);
    }
    const deptname =  getMulSolNameById(accesstodept);
    setargdept(deptname);
    setShowUpdateMemberModal(true);
  };

  return (
    <>
      {/* {argstaff && ( */}
        <UpdateAccessControl
          showModal={showUpdateMemberModal}
          handleCloseModal={handleUpdateCloseModal}
          argstaff={argstaff}
          argdept={argdept}
          id={id}
          model={model}
        />
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteaccesscontrols({ id: deleteid, toast }))}
      />
      <div className="card mt-3 text-center">
        <div className="card-header">
          <strong>ACCESS CONTROLS</strong>
        </div>
        <div className="card-body text-center">
          <div className="table-responsive">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">S.N.</th>
                  <th scope="col">STAFF</th>
                  <th scope="col">JOBID</th>
                  <th scope="col">ACCESS TO DEPT</th>
                  <th scope="col">CreatedDate</th>
                  <th scope="col">CREATEDBY</th>
                  <th scope="col">MODIFIED DATE</th>
                  <th scope="col">MODIFIEDBY</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {accesscontrols &&
                  accesscontrols.map((all, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{getStaffNameById(all.STAFF_ID)}</td>
                        <td>{all.JOB_ID}</td>
                        <td>{getDeptNameById(all.ACCESS_TO_DEPT)}</td>
                        {/* <td>{getJobNameById(all.JOB_ID)}</td> */}
                        {/* <td>{getSolNameById(all.ACCESS_TO_SOL)}</td> */}
                        <td>{new Date(all.createdAt).toLocaleString()}</td>
                        <td>{all.CREATED_BY}</td>
                        <td>{new Date(all.updatedAt).toLocaleString()}</td>
                        <td>{all.UPDATED_BY}</td>
                        <td>
                          <div className="d-flex">
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => {
                                if (all.STAFF_ID !== null) {
                                  handleUpdateOpenModal(
                                    "STAFF_ID",
                                    all.STAFF_ID,
                                    all.ACCESS_TO_DEPT,
                                    all.id
                                  );
                                } else if (all.JOB_ID != null) {
                                  handleUpdateOpenModal(
                                    "JOB_ID",
                                    all.JOB_ID,
                                    all.ACCESS_TO_DEPT,
                                    all.id
                                  );
                                }
                              }}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger ml-1"
                              onClick={() => handleOpenDeleteModal(all)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetAccessControl;
