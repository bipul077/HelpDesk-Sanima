import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getuserTicket } from "src/store/TicketSlice";
import { filtercategoryticket } from "src/store/FilterTicketSlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import progressgif from "src/assets/images/pending.gif";
import newgif from "src/assets/images/new.gif";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { clearticketError } from "src/store/TicketSlice";

const UserTicket = () => {
  const dispatch = useDispatch();
  const { userticket, ticketloading, ticketerror, PagesCount } = useSelector(
    (state) => state.ticket
  ); //state.ticket should match with store.js

  const { fyOption } = useSelector((state) => state.report);

  const [fydrop, setFydrop] = useState({
    label: "Fiscal Year",
    value: "",
  });
  const [SearchData, setSearchData] = useState();

  useEffect(() => {
    //dispatch an action for getCategory
    dispatch(getuserTicket({ currentPage: 1 }));
    dispatch(filtercategoryticket());
  }, [dispatch]);

  useEffect(() => {
    if(ticketerror){
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror,dispatch]);


  if (ticketloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    if (SearchData || fydrop.value) {
      dispatch(
        getuserTicket({
          currentPage,
          search: SearchData ? SearchData.search : "",
          fiscalyear: fydrop.value,
        })
      );
    } else {
      dispatch(getuserTicket({ currentPage }));
    }
  };

  const handleFyChange = async (eventKey, label) => {
    setFydrop({ label, value: eventKey });
    dispatch(
      getuserTicket({
        currentPage: 1,
        fiscalyear: eventKey,
      })
    );
  };

  const schema = yup.object().shape({
    search: yup.string().required().trim(),
  });

  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    setSearchData({ ...data });
    dispatch(
      getuserTicket({
        currentPage: 1,
        search: data.search,
        fiscalyear: fydrop.value,
      })
    );
  };

  return (
    <div>
      <div className="container-fluid min-vh-100">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>Tickets Created By You</h3>
            <div className="d-flex">
              <DropdownButton
                id="dropdown-basic-button"
                title={fydrop.label}
                variant="dark"
                onSelect={(eventKey, event) =>
                  handleFyChange(eventKey, event.target.textContent)
                }
              >
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {fyOption.map((x, index) => (
                    <Dropdown.Item key={index} eventKey={x.label}>
                      {x.label}
                    </Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
              <form
                className="form-inline ml-2"
                onSubmit={handleSubmit(submitForm)}
              >
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search id,Title,User,Assigned,Category"
                  style={{ width: '300px' }}
                  {...register("search")}
                />
                <button className="btn btn-success" type="submit">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-striped table-bordered text-center">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Category</th>
                  <th scope="col">SOL</th>
                  <th scope="col">User</th>
                  <th scope="col">Assigned</th>
                  <th scope="col">Department</th>
                  <th scope="col">Last Reply</th>
                  <th scope="col">Options</th>
                </tr>
              </thead>
              <tbody>
                {userticket.map((all, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <th scope="row">{all.id}</th>
                      <td>{all.Ticket_Subject}</td>
                      <td
                        className={
                          all.Ticket_Priority === "Low"
                            ? "badge rounded-pill bg-light text-dark mt-2"
                            : all.Ticket_Priority === "Medium"
                            ? "badge rounded-pill bg-info mt-2"
                            : all.Ticket_Priority === "High"
                            ? "badge rounded-pill bg-warning text-dark mt-2"
                            : all.Ticket_Priority === "Urgent"
                            ? "badge rounded-pill bg-danger mt-2"
                            : ""
                        }
                      >
                        {all.Ticket_Priority}
                      </td>
                      <td>
                        {all.Ticket_Status === "In Progress" ? (
                          <>
                            <img
                              src={progressgif}
                              alt="Current GIF"
                              height={25}
                            />
                          </>
                        ) : all.Ticket_Status === "New" ? (
                          <>
                            <img src={newgif} alt="New Gif" height={25} />
                          </>
                        ) : (
                          ""
                        )}
                        {all.Ticket_Status}
                      </td>
                      {/* <td></td> */}
                      <td>{all.Category && all.Category.Name}</td>
                      <td>{all.branch && all.branch.BranchName}</td>
                      <td>{all.User}</td>
                      <td>{all.Assign_User}</td>
                      <td>{all.departments && all.departments.Name}</td>
                      <td>
                        {all.ticketreply && all.ticketreply.length > 0 && (
                          <>
                            {
                              all.ticketreply[all.ticketreply.length - 1]
                                .Replied_By
                            }{" "}
                            {new Date(
                              all.ticketreply[
                                all.ticketreply.length - 1
                              ].updatedAt
                            ).toLocaleString()}
                          </>
                        )}
                      </td>
                      <td>
                        <NavLink to={`/viewticket/${all.id}`}>
                          <button className="btn btn-info">View</button>
                        </NavLink>
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
              pageCount={PagesCount}
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
  );
};

export default UserTicket;
