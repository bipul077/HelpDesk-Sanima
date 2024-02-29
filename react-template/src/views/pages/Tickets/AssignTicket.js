import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getassignTicket } from "src/store/TicketSlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { filtercategoryticket,clearfticketError } from "src/store/FilterTicketSlice";
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

const AssignTicket = () => {
  const dispatch = useDispatch();
  const { assignticket, ticketloading, ticketerror, PagesCount } = useSelector(
    (state) => state.ticket
  ); //state.ticket should match with store.js
  const { filtercategory, fticketloading, fticketerror } = useSelector(
    (state) => state.filterticket
  );
  const { filterStatus } =
  useSelector((state) => state.filterticket);
  const { fyOption } = useSelector((state) => state.report);

  const [categorydrop, setCategorydrop] = useState({
    label: "Category",
    value: "",
  });
  const [fydrop, setFydrop] = useState({
    label: "Fiscal Year",
    value: "",
  });
  const [statusdrop, setStatusdrop] = useState({
    label: "Status",
    value: "",
  });
  const [SearchData, setSearchData] = useState();

  useEffect(() => {
    //dispatch an action for getCategory
    dispatch(getassignTicket({ currentPage: 1 }));
    dispatch(filtercategoryticket());
  }, [dispatch]);

  useEffect(() => {
    if(ticketerror){
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror,dispatch]);

  useEffect(() => {
    if(fticketerror){
      toast.error(fticketerror);
      dispatch(clearfticketError());
    }
  }, [fticketerror,dispatch]);

  if (fticketloading === true || ticketloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const schema = yup.object().shape({
    search: yup.string().required().trim(),
  });

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    if (SearchData || categorydrop.value || fydrop.value || statusdrop.value) {
      dispatch(
        getassignTicket({
          currentPage,
          search: SearchData ? SearchData.search : "",
          category: categorydrop.value,
          fiscalyear: fydrop.value,
          status: statusdrop.value
        })
      );
    } else {
      dispatch(getassignTicket({ currentPage }));
    }
  };

  const handleFyChange = async (eventKey, label) => {
    setFydrop({ label, value: eventKey });
    dispatch(
      getassignTicket({
        currentPage: 1,
        category: categorydrop.value,
        fiscalyear: eventKey,
        status: statusdrop.value
      })
    );
  };

  const handleStatusChange = async (eventKey, label) => {
    setStatusdrop({ label, value: eventKey });
    dispatch(
      getassignTicket({
        currentPage: 1,
        category: categorydrop.value,
        fiscalyear: fydrop.value,
        status: eventKey
      })
    );
  };

  const handleCatChange = async (eventKey, label) => {
    setCategorydrop({ label: label, value: eventKey });
    dispatch(
      getassignTicket({
        currentPage: 1,
        category: eventKey,
        fiscalyear: fydrop.value,
        status: statusdrop.value
      })
    );
  };

  const submitForm = (data) => {
    setSearchData({ ...data });
    dispatch(
      getassignTicket({
        category: categorydrop.value,
        search: data.search,
        fiscalyear: fydrop.value,
        status: statusdrop.value
      })
    );
  };

  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

  return (
    <div>
      <div className="container-fluid min-vh-100">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>Tickets Assigned To You</h3>
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
              <DropdownButton
                className="ml-2"
                id="dropdown-basic-button"
                title={statusdrop.label}
                variant="dark"
                onSelect={(eventKey, event) =>
                  handleStatusChange(eventKey, event.target.textContent)
                }
              >
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {filterStatus.map((x, index) => (
                    <Dropdown.Item key={index} eventKey={x.value}>
                      {x.label}
                    </Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
              <DropdownButton
                className="ml-2"
                id="dropdown-basic-button"
                title={categorydrop.label}
                variant="dark"
                // onSelect={handleCatChange}
                onSelect={(eventKey, event) =>
                  handleCatChange(eventKey, event.target.textContent)
                }
              >
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {filtercategory.map((x) => (
                    <Dropdown.Item key={x.id} eventKey={x.id}>
                      {x.Name}
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
                  placeholder="Search id,Title,User,Assigned"
                  style={{ width: '200px' }}
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
                {assignticket.map((all, index) => (
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

export default AssignTicket;
