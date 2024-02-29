import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { getroles, deleteroles } from "src/store/UserSlice";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { toast } from "react-toastify";
import { clearUserError } from "src/store/UserSlice";

const AddRole = React.lazy(() => import("./AddRole"));
const UpdateRole = React.lazy(() => import("./UpdateRole"));
const DeleteModal = React.lazy(() => import("../../Category/DeleteModal"));

const Userroles = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const handleOpenModal = () => setShowRoleModal(true);
  const handleCloseModal = () => setShowRoleModal(false);
  const [updatedata, setupdatedata] = useState(null);
  const [deleteid, setdeleteid] = useState();

  const { roles, userloading, usererror } = useSelector((state) => state.user);

  const handleUpdateCloseModal = () => setShowUpdateRoleModal(false);
  const handleCloseDeleteModal = () => setshowDeleteModal(false);
  const dispatch = useDispatch();

  const handleUpdateOpenModal = (all) => {
    setupdatedata(all);
    setShowUpdateRoleModal(true);
  };

  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };

  useEffect(() => {
    dispatch(getroles());
  }, [dispatch]);

  useEffect(() => {
    if(usererror){
      toast.error(usererror);
      dispatch(clearUserError());
    }
  }, [usererror,dispatch]);

  if (userloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  return (
    <div>
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteroles({ id: deleteid, toast }))}
      />
      <AddRole showModal={showRoleModal} handleCloseModal={handleCloseModal} />
      {updatedata && (
        <UpdateRole
          showModal={showUpdateRoleModal}
          handleCloseModal={handleUpdateCloseModal}
          preloadedData={updatedata}
        />
      )}
      <div className="container-fluid min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="card p-3 mb-5">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3>Users</h3>
                  <div className="d-flex">
                    {/* <h3>Add Tickets</h3> */}

                    <button
                      className="btn btn-primary ml-3"
                      onClick={() => handleOpenModal()}
                    >
                      Add User Role
                    </button>
                  </div>
                </div>
                <table className="table table-striped table-bordered text-center">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Role Name</th>
                      <th scope="col">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((data, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{data.RoleName}</td>
                            <td>
                              {" "}
                              <CIcon
                                content={freeSet.cilSettings}
                                customClasses="c-sidebar-nav-icon"
                                onClick={() => handleUpdateOpenModal(data)}
                              />
                              <CIcon
                                content={freeSet.cilTrash}
                                customClasses="c-sidebar-nav-icon ml-2"
                                onClick={() => handleOpenDeleteModal(data)}
                              />
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userroles;
