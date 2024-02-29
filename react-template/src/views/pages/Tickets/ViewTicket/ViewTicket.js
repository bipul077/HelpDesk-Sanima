import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getspecificTicket,
  getreply,
  addstatus,
} from "src/store/ViewTicketSlice";
import { getspecificmember } from "src/store/UserSlice";

import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";
import { sanitize } from "isomorphic-dompurify";
import AssignModal from "../AssignModal";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { getDepartment } from "src/store/TicketSlice";
import {
  switchdepartment,
  userDetail,
  addassignuserself,
  updateUserDetail,
} from "src/store/ViewTicketSlice";
import AssignSelf from "./AssignSelf";
import { decodeToken } from "react-jwt";
import AcknowledgeTicket from "./AcknowledgeTicket";
import {
  clearVticketError,
  checkviewticket,
  clearviewticket,
} from "src/store/ViewTicketSlice";
import { clearticketError } from "src/store/TicketSlice";
import { clearUserError } from "src/store/UserSlice";

const TicketReply = React.lazy(() => import("../Reply/AddReply"));
const Reply = React.lazy(() => import("../Reply/Reply"));
const TicketLogs = React.lazy(() => import("./Ticketlogs"));
const SwitchModal = React.lazy(() => import("../SwitchModal"));
const EditSeverity = React.lazy(() => import("./SeverityChange"));
const EditCategory = React.lazy(() => import("./CategoryChange"));

const ViewTicket = () => {
  const history = useHistory();
  let sanitizedHtml;
  const dispatch = useDispatch();
  const { ticketId } = useParams();
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const [showSwitchModal, setshowSwitchModal] = useState(false);
  const [showAssignSelfModal, setshowAssignSelfModal] = useState(false);
  const [selectedDept, setselectedDept] = useState({
    deptid: "",
    deptname: "",
  });
  const [updatedata, setupdatedata] = useState(null);
  const [catdata, setCatdata] = useState({ catid: "", subcatid: "" });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const handleCloseSwitchModal = () => setshowSwitchModal(false);
  const handleCloseSelfAssignModal = () => setshowAssignSelfModal(false);

  const handleOpenSelfAssignModal = () => {
    setshowAssignSelfModal(true);
  };

  const { department, ticketloading, ticketerror } = useSelector(
    (state) => state.ticket
  );

  const {
    Ticketdata,
    replies,
    userdetail,
    vticketloading,
    vticketerror,
    cviewticket,
  } = useSelector((state) => state.viewticket);

  const { myuser, userloading, usererror } = useSelector((state) => state.user);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false);
  const handleOpenModal = () => setShowAssignModal(true);
  const handleCloseModal = () => setShowAssignModal(false);
  const handleAcknowledgeOpenModal = () => setShowAcknowledgeModal(true);
  const handleAcknowledgeCloseModal = () => setShowAcknowledgeModal(false);

  useEffect(() => {
    if (ticketId) {
      dispatch(clearviewticket());
      dispatch(getspecificTicket({ id: ticketId }));
      dispatch(checkviewticket({ id: ticketId }));
    }
  }, [dispatch, ticketId]);

  useEffect(() => {
    dispatch(getreply({ id: ticketId }));
    dispatch(getDepartment());
  }, [dispatch, ticketId]);

  useEffect(() => {
    dispatch(
      getspecificmember({ StaffId: decodedToken.data.recordset[0].StaffId })
    );
  }, [dispatch]);

  useEffect(() => {
    if (Ticketdata.StaffId) {
      dispatch(userDetail({ id: Ticketdata.StaffId }));
    }
  }, [dispatch, Ticketdata]);

  useEffect(() => {
    if (ticketerror) {
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror, dispatch]);

  useEffect(() => {
    if (vticketerror) {
      toast.error(vticketerror);
      dispatch(clearVticketError());
    }
  }, [vticketerror, dispatch]);

  useEffect(() => {
    if (usererror) {
      toast.error(usererror);
      dispatch(clearUserError());
    }
  }, [usererror, dispatch]);

  if (
    ticketloading === true ||
    vticketloading === true ||
    userloading === true
  ) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const sideBarToggle = (event) => {
    var parentElement = event.target.parentNode;
    var nameOfClass = event.target.parentNode.className;
    if (nameOfClass.split(" ").includes("c-show")) {
      parentElement.classList.remove("c-show");
    } else {
      parentElement.classList.add("c-show");
    }
  };

  const handleUpdateOpenModal = (id) => {
    setupdatedata(id);
    setShowUpdateModal(true);
  };

  const handleCatOpenModal = (...args) => {
    setCatdata({ catid: args[0], subcatid: args[1] });
    setShowCatModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
  const handleCatCloseModal = () => setShowCatModal(false);

  if (Ticketdata.Ticket_Body) {
    sanitizedHtml = sanitize(Ticketdata.Ticket_Body);
  }

  const handleDropdownSelect = (eventKey) => {
    // console.log("Selected item:", eventKey);
    dispatch(
      addstatus({
        status: eventKey,
        toast,
        id: Ticketdata.id,
        message: "Ticket status changed successfully",
      })
    );
  };

  const handleDropdownSwitchSelect = (eventKey, label) => {
    setselectedDept({ deptid: parseInt(eventKey), deptname: label });
    setshowSwitchModal(true);
  };

  const convertMsToTime = (milliseconds) => {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    const days = Math.floor(hours / 24);
    hours = hours % 24;

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  };

  return (
    <>
      {cviewticket === true ? (
        <>
          <EditSeverity
            showModal={showUpdateModal}
            handleCloseModal={handleUpdateCloseModal}
            sevid={updatedata}
            ticketId={ticketId}
          />
          <EditCategory
            showModal={showCatModal}
            handleCloseModal={handleCatCloseModal}
            data={catdata}
            ticketId={ticketId}
          />
          <AcknowledgeTicket
            showModal={showAcknowledgeModal}
            handleCloseModal={handleAcknowledgeCloseModal}
            id={Ticketdata.id}
          />
          <AssignSelf
            showModal={showAssignSelfModal}
            handleCloseModal={handleCloseSelfAssignModal}
            method={() =>
              dispatch(
                addassignuserself({
                  id: Ticketdata.id,
                  assignuser: decodedToken.data.recordset[0].StaffId,
                  toast,
                  message: "User Assign Successfully",
                })
              )
            }
          />
          <SwitchModal
            showModal={showSwitchModal}
            handleCloseModal={handleCloseSwitchModal}
            method={() =>
              dispatch(
                switchdepartment({
                  id: Ticketdata.id,
                  toast,
                  status: selectedDept.deptid,
                  history,
                })
              )
            }
            dept={selectedDept.deptname}
          />
          <AssignModal
            showModal={showAssignModal}
            handleCloseModal={handleCloseModal}
            id={Ticketdata.id}
          />
          <div className="row">
            <div className="col-sm-8">
              <div className="card p-3">
                <div className="col-sm">
                  <span
                    className={
                      Ticketdata.Ticket_Priority === "Low"
                        ? "badge badge-light float-right"
                        : Ticketdata.Ticket_Priority === "Medium"
                        ? "badge badge-info float-right"
                        : Ticketdata.Ticket_Priority === "High"
                        ? "badge badge-warning float-right"
                        : Ticketdata.Ticket_Priority === "Urgent"
                        ? "badge badge-danger float-right"
                        : ""
                    }
                  >
                    {Ticketdata.Ticket_Priority}
                  </span>
                </div>
                <table className="table table-bordered mt-4">
                  <tbody>
                    <tr>
                      <td className="col-sm-3">Requested By</td>
                      <td>{Ticketdata.User}</td>
                    </tr>
                    <tr>
                      <td>Ticket Subject</td>
                      <td>{Ticketdata.Ticket_Subject}</td>
                    </tr>
                    <tr>
                      <td>Ticket Body</td>
                      <td>
                        <div
                          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                          style={{
                            maxWidth: "650px",
                            maxHeight: "400px",
                            overflow: "auto",
                          }}
                        ></div>
                      </td>
                    </tr>
                    <tr>
                      <td>Severity</td>
                      <td>
                        {Ticketdata.severity && Ticketdata.severity.Name}
                        <button
                          className="btn btn-sm btn-info float-right"
                          title="Edit Severity"
                          onClick={() =>
                            handleUpdateOpenModal(Ticketdata.Severity_id)
                          }
                          disabled={
                            Ticketdata.Ticket_Status === "Closed" ||
                            ((myuser && myuser.role_id) !== 2 &&
                              decodedToken &&
                              Ticketdata.Assign_User !==
                                decodedToken.data.recordset[0].Username)
                          }
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                      </td>
                    </tr>

                    {Ticketdata.Ticketimages &&
                      Ticketdata.Ticketimages.map((all, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td>File {index + 1}</td>
                            <td>
                              <a
                                href={process.env.REACT_APP_API_URL + all.Name}
                                target="_blank"
                              >
                                {all.Name}
                              </a>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
                <button
                  className="btn btn-success"
                  onClick={() =>
                    dispatch(
                      updateUserDetail({
                        id: Ticketdata.id,
                        username: decodedToken.data.recordset[0].Username,
                        staffid: decodedToken.data.recordset[0].StaffId,
                        toast,
                      })
                    )
                  }
                  disabled={
                    decodedToken &&
                    (Ticketdata.Acknowledge_User !==
                      decodedToken.data.recordset[0].Username ||
                      Ticketdata.User ===
                        decodedToken.data.recordset[0].Username)
                  }
                >
                  Acknowledge Ticket
                </button>
              </div>
              <div className="card p-3">
                <h4>Replies</h4>
                {replies.map((all, index) => (
                  <Reply key={index} replies={all} />
                ))}
              </div>
              <TicketReply Ticketdata={Ticketdata} />
            </div>
            <div className="col-sm-4">
              <div className="card">
                <div
                  onClick={(event) => sideBarToggle(event)}
                  className="c-sidebar-nav-dropdown c-show"
                >
                  <p
                    className="c-sidebar-nav-dropdown-toggle"
                    aria-label="menu dropdown"
                  >
                    <strong>Ticket Details</strong>
                  </p>
                  <div className="c-sidebar-nav-dropdown-items">
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Ticket Number:</strong>
                      </div>
                      <div className="col-md-6">{Ticketdata.id}</div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Ticket Status:</strong>
                      </div>
                      <div className="col-md-6">{Ticketdata.Ticket_Status}</div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Department:</strong>
                      </div>
                      <div className="col-md-6">
                        {Ticketdata.departments && Ticketdata.departments.Name}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Category:</strong>
                      </div>
                      <div className="col-md-6">
                        {Ticketdata.Category ? Ticketdata.Category.Name : ""}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Sub-Category:</strong>
                      </div>
                      <div className="col-md-6">
                        {Ticketdata.SubCategory
                          ? Ticketdata.SubCategory.Name
                          : "Null"}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Priority:</strong>
                      </div>
                      <div className="col-md-6">
                        {Ticketdata.Ticket_Priority}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Created On:</strong>
                      </div>
                      <div className="col-md-6">
                        {new Date(Ticketdata.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Updated On:</strong>
                      </div>
                      <div className="col-md-6">
                        {new Date(Ticketdata.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Time Worked:</strong>
                      </div>
                      <div className="col-md-6">
                        {convertMsToTime(Ticketdata.total_worked)}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Assigned User:</strong>
                      </div>
                      <div className="col-md-6">{Ticketdata.Assign_User}</div>
                    </div>
                    <div className="d-flex">
                      <div className="col-md-6">
                        <strong>Replies:</strong>
                      </div>
                      <div className="col-md-6 mb-2">{replies.length}</div>
                    </div>
                    <div className="d-flex">
                      <div className="col-md-6">
                        <strong>Ticket Created From IP:</strong>
                      </div>
                      <div className="col-md-6 mb-2">{Ticketdata.Ip}</div>
                    </div>
                    <div className="d-flex pl-2 pt-2">
                      <div className="mr-2" title="Ticket Status">
                        <DropdownButton
                          as={ButtonGroup}
                          key="up"
                          id="dropdown-button-drop-up"
                          drop="up"
                          disabled={
                            (decodedToken &&
                              Ticketdata.Assign_User !==
                                decodedToken.data.recordset[0].Username) ||
                            Ticketdata.Ticket_Status === "Closed"
                          }
                          variant={
                            Ticketdata.Ticket_Status === "New"
                              ? "info"
                              : Ticketdata.Ticket_Status === "In Progress"
                              ? "warning"
                              : Ticketdata.Ticket_Status === "Closed"
                              ? "danger"
                              : ""
                          }
                          size="md"
                          title={Ticketdata.Ticket_Status || ""}
                          onSelect={handleDropdownSelect}
                        >
                          <Dropdown.Item eventKey="New">New</Dropdown.Item>
                          <Dropdown.Item eventKey="In Progress">
                            In Progress
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="Closed">
                            Closed
                          </Dropdown.Item>
                        </DropdownButton>
                      </div>

                      <div title="Switch Department">
                        <DropdownButton
                          as={ButtonGroup}
                          key="up"
                          id="dropdown-button-drop-up"
                          drop="up"
                          variant="dark"
                          size="md"
                          title={
                            Ticketdata.departments
                              ? Ticketdata.departments.Name
                              : ""
                          }
                          disabled={
                            Ticketdata.Ticket_Status === "Closed" ||
                            (myuser && myuser.role_id) !== 2
                          }
                          onSelect={(eventKey, event) =>
                            handleDropdownSwitchSelect(
                              eventKey,
                              event.target.textContent
                            )
                          }
                        >
                          {department.map((data, index) => (
                            <Dropdown.Item key={index} eventKey={data.value}>
                              {data.label}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                      </div>
                      <button
                        className="btn rounded-pill btn-primary ml-2"
                        title="Assign Yourself"
                        onClick={() => handleOpenSelfAssignModal()}
                        disabled={
                          Ticketdata.Assign_User !== "" ||
                          (decodedToken &&
                            !["7", "23", "65", "66", "67"].includes(
                              decodedToken.data.recordset[0].DeptId
                            ))
                        }
                      >
                        <i
                          class="fa fa-thumb-tack"
                          style={{ transform: "rotate(20deg)" }}
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                    <div className="pl-2 pt-2 pb-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAcknowledgeOpenModal()}
                        disabled={
                          (myuser && myuser.role_id) !== 2 ||
                          (decodedToken &&
                            Ticketdata.User !==
                              decodedToken.data.recordset[0].Username)
                        }
                      >
                        Acknowledge User
                      </button>

                      <button
                        className="btn btn-primary ml-2"
                        title="Assign Ticket"
                        onClick={() => handleOpenModal()}
                        disabled={
                          Ticketdata.Ticket_Status === "Closed" ||
                          ((myuser && myuser.role_id) !== 2 &&
                            decodedToken &&
                            Ticketdata.Assign_User !==
                              decodedToken.data.recordset[0].Username)
                        }
                      >
                        Assign Ticket
                      </button>

                      <button
                        className="btn btn-dark ml-2"
                        title="Change Category/SubCategory"
                        disabled={
                          Ticketdata.Ticket_Status === "Closed" ||
                          ((myuser && myuser.role_id) !== 2 &&
                            decodedToken &&
                            Ticketdata.Assign_User !==
                              decodedToken.data.recordset[0].Username)
                        }
                        onClick={() =>
                          handleCatOpenModal(
                            Ticketdata.Category_id,
                            Ticketdata.SubCategory_id
                          )
                        }
                      >
                        <i className="fa fa-th-large" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div
                  onClick={(event) => sideBarToggle(event)}
                  className="c-sidebar-nav-dropdown c-show" //for showing the accordion at default we add c-show class
                >
                  <p
                    className="c-sidebar-nav-dropdown-toggle"
                    aria-label="menu dropdown"
                  >
                    <strong>User Details</strong>
                  </p>
                  <div className="c-sidebar-nav-dropdown-items">
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Staff Id:</strong>
                      </div>
                      <div className="col-md-6">{Ticketdata.StaffId}</div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Full Name:</strong>
                      </div>
                      <div className="col-md-6">
                        {userdetail.name && userdetail.name.fullName}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Username:</strong>
                      </div>
                      <div className="col-md-6">{userdetail.username}</div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Contact:</strong>
                      </div>
                      <div className="col-md-6">
                        {userdetail.phone && userdetail.phone.mobileNumber}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Branch:</strong>
                      </div>
                      <div className="col-md-6">
                        {userdetail.branch && userdetail.branch.branchName}
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="col-md-6">
                        <strong>Email:</strong>
                      </div>
                      <div className="col-md-6">{userdetail.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div
                  onClick={(event) => sideBarToggle(event)}
                  className="c-sidebar-nav-dropdown c-show"
                >
                  <p
                    className="c-sidebar-nav-dropdown-toggle"
                    aria-label="menu dropdown"
                  >
                    <strong>Ticket History</strong>
                  </p>

                  <div
                    className="c-sidebar-nav-dropdown-items"
                    style={{ height: "250px", overflowY: "scroll" }}
                  >
                    {Ticketdata.ticketlogs &&
                      Ticketdata.ticketlogs.map((items, index) => (
                        <TicketLogs key={index} item={items} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h3>Ticket Not Authorized</h3>
      )}
    </>
  );
};

export default ViewTicket;
