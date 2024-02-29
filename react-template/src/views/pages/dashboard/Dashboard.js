import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";
import { sanitize } from "isomorphic-dompurify";
import { ticketscount, clearDashError } from "src/store/DashboardSlice";
import { getnotice, clearEodError } from "src/store/EodSlice";

const Dashboard = () => {
  let sanitizedHtml;
  const dispatch = useDispatch();
  const { ticketcount, dashloading, dasherror } = useSelector(
    (state) => state.dashboard
  );
  const { notice, eodloading, eoderror } = useSelector((state) => state.eod);

  useEffect(() => {
    dispatch(ticketscount());
    dispatch(getnotice());
  }, [dispatch]);

  useEffect(() => {
    if (dasherror) {
      toast.error(dasherror);
      dispatch(clearDashError());
    }
  }, [dasherror, dispatch]);

  useEffect(() => {
    if (eoderror) {
      toast.error(eoderror);
      dispatch(clearEodError());
    }
  }, [eoderror, dispatch]);

  if (dashloading === true || eodloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  if (notice) {
    sanitizedHtml = sanitize(notice.Content);
  }

  return (
    <>
      <div className="card">
        <div className="card-header text-center">
          <h3>EOD Notice</h3>
        </div>
        <div className="card-body text-center">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" className="col-md-8">
                  Content
                </th>
                <th scope="col">Created_By</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            {notice && (
              <tbody>
                <tr>
                  <td>
                    {" "}
                    <div
                      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                      style={{
                        maxWidth: "650px",
                        maxHeight: "400px",
                        overflow: "auto",
                      }}
                    ></div>
                  </td>
                  <td>{notice.Created_By}</td>
                  <td>{new Date(notice.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      <div className="card p-3">
        <div className="row ml-1 mr-1">
          <div className="col-md-3">
            <NavLink
              to="/tickets"
              title="All Tickets"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <div className="p-3 mb-5 mr-md-1 bg-info rounded row">
                <i
                  className="col-md-4 fa fa-paper-plane fa-4x"
                  aria-hidden="true"
                ></i>
                <span className="col-md">
                  <i className="fa-2x">{ticketcount.allTickets}</i>
                  <br />
                  <b>Total Tickets</b>
                </span>
              </div>
            </NavLink>
          </div>
          <div className="col-md-3">
            <div className="p-3 mb-5 bg-danger rounded row">
              <i className="col-md-4 fa fa-users fa-4x" aria-hidden="true"></i>
              <span className="col-md">
                <i className="fa-2x">{ticketcount.assignedTickets}</i>
                <br />
                <b>Assigned Tickets</b>
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 mb-5 ml-md-1 bg-light rounded row ">
              <i className="col-md-4 fa fa-ticket fa-4x" aria-hidden="true"></i>
              <span className="col-md">
                <i className="fa-2x">{ticketcount.todayTickets}</i>
                <br />
                <b>Tickets Today</b>
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <NavLink
              to="/tickets?status=New"
              title="New Tickets"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <div className="p-3 mb-5 ml-md-1 bg-warning rounded row ">
                <i
                  className="col-md-4 fa fa-hand-paper-o fa-4x"
                  aria-hidden="true"
                ></i>
                <span className="col-md">
                  <i className="fa-2x">{ticketcount.newTickets}</i>

                  <br />
                  <b>New Tickets</b>
                </span>
              </div>
            </NavLink>
          </div>
        </div>
        <div className="row ml-1 mr-1">
          <div className="col-md-4">
            <NavLink
              to="/assignticket"
              title="Ticket Assigned To You"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <div className="p-3 mb-5 bg-info rounded row">
                <i className="col-md-4 fa fa-user fa-4x" aria-hidden="true"></i>
                <span className="col-md">
                  <i className="fa-2x">{ticketcount.ticketassignedtoyou}</i>

                  <br />
                  <b>Tickets Assigned To You</b>
                </span>
              </div>
            </NavLink>
          </div>

          <div className="col-md-4">
            <NavLink
              to="/tickets?status=In Progress"
              title="New Tickets"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <div className="p-3 mb-5 ml-md-1 bg-danger rounded row">
                <i
                  className="col-md-4 fa fa-spinner fa-4x"
                  aria-hidden="true"
                ></i>
                <span className="col-md">
                  <i className="fa-2x">{ticketcount.pendingTickets}</i>
                  <br />
                  <b>In-Progress Tickets</b>
                </span>
              </div>
            </NavLink>
          </div>
          <div className="col-md-4">
            <NavLink
              to="/tickets?status=Closed"
              title="New Tickets"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <div className="p-3 mb-5 ml-md-1 bg-success rounded row">
                <i
                  className="col-md-4 fa fa-check fa-4x"
                  aria-hidden="true"
                ></i>
                <span className="col-md">
                  <i className="fa-2x">{ticketcount.closedTickets}</i>

                  <br />
                  <b>Completed Tickets</b>
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
