import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getusers, deleteuser } from "src/store/UserSlice";
import { toast } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { verifyrole } from "src/store/LoginSlice";
import { clearticketError } from "src/store/TicketSlice";
import { clearUserError } from "src/store/UserSlice";
import ReactPaginate from "react-paginate";
import { clearCatError } from "src/store/CategorySlice";
import { getDepartment } from "src/store/TicketSlice";
import { getEmployees } from "src/store/AccessSlice";
import { getroles } from "src/store/UserSlice";

const AddMember = React.lazy(() => import("./AddMember"));
const UpdateMember = React.lazy(() => import("./UpdateMember"));
const DeleteModal = React.lazy(() => import("../../Category/DeleteModal"));

const Members = () => {
  const dispatch = useDispatch();
  const {
    users,
    userloading,
    usererror,
    userpage,
    ticketloading,
    ticketerror,
    caterror,
    catloading,
    accessloading,
    accesserror,
  } = useSelector((state) => ({
    ...state.user,
    ...state.ticket,
    ...state.category,
    ...state.accesscontrol,
  }));

  const [deleteid, setdeleteid] = useState();
  const [updatedata, setupdatedata] = useState(null);
  const [showUpdateMemberModal, setShowUpdateMemberModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const handleOpenModal = () => setShowMemberModal(true);
  const handleCloseModal = () => setShowMemberModal(false);
  const handleUpdateOpenModal = (all) => {
    setupdatedata(all);
    setShowUpdateMemberModal(true);
  };
  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setshowDeleteModal(false);
  const handleUpdateCloseModal = () => setShowUpdateMemberModal(false);

  useEffect(() => {
    dispatch(getusers({ currentPage: 1 }));
    dispatch(verifyrole({ role: "verifyadmin" }));
    dispatch(getEmployees());
    dispatch(getroles());
    dispatch(getDepartment());
  }, [dispatch]);

  useEffect(() => {
    if (usererror) {
      toast.error(usererror);
      dispatch(clearUserError());
    }
  }, [usererror, dispatch]);

  useEffect(() => {
    if (ticketerror) {
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror, dispatch]);

  useEffect(() => {
    if (accesserror) {
      toast.error(accesserror);
      dispatch(clearticketError());
    }
  }, [accesserror, dispatch]);

  useEffect(() => {
    if (caterror) {
      toast.error(caterror);
      dispatch(clearCatError());
    }
  }, [caterror, dispatch]);

  if (
    userloading === true ||
    ticketloading === true ||
    catloading === true ||
    accessloading === true
  ) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    dispatch(getusers({ currentPage }));
  };

  return (
    <div>
      {updatedata && (
        <UpdateMember
          showModal={showUpdateMemberModal}
          handleCloseModal={handleUpdateCloseModal}
          preloadedData={updatedata}
        />
      )}
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteuser({ id: deleteid, toast }))}
      />
      <AddMember
        showModal={showMemberModal}
        handleCloseModal={handleCloseModal}
      />
      <div className="container-fluid min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="card p-3 mb-5">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3>Members</h3>
                  <div className="d-flex">
                    {/* <h3>Add Tickets</h3> */}
                    <button
                      className="btn btn-primary ml-3"
                      onClick={() => handleOpenModal()}
                    >
                      Add Member
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <table className="table table-responsive table-striped table-bordered text-center">
                    <thead>
                      <tr>
                        <th scope="col">StaffId</th>
                        <th scope="col">Username</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Dept</th>
                        <th scope="col">Category</th>
                        <th scope="col">Role</th>
                        <th scope="col">UpdatedAt</th>
                        <th scope="col">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((data, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <th scope="row">{data.StaffId}</th>
                            <td>{data.Username}</td>
                            <td>{data.Name}</td>
                            <td>{data.Email}</td>
                            <td>{data.BranchName}</td>
                            <td>{data.DepartmentName}</td>
                            <td>{data.Category && data.Category.Name}</td>
                            <td>{data.userroles && data.userroles.RoleName}</td>
                            <td>{new Date(data.updatedAt).toLocaleString()}</td>
                            <td>
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
                <div className="card-footer">
                  <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    pageCount={userpage}
                    marginPagesDisplayed={2} //number of page to be displayed at the end(before next)
                    pageRangeDisplayed={2} //number of pages showing after clicking break item
                    onPageChange={handlePageChange}
                    containerClassName={"pagination justify-content-center"} //bootstrap class
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
