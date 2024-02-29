import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import progressgif from "src/assets/images/pending.gif";
import newgif from "src/assets/images/new.gif";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { clearticketError, getacknowledgeTicket } from "src/store/TicketSlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";

const TicketAcknowledge = () => {
  const dispatch = useDispatch();
  const { acknowledgeticket, ticketloading, ticketerror, PagesCount } =
    useSelector((state) => state.ticket);
  const [SearchData, setSearchData] = useState();
  const schema = yup.object().shape({
    search: yup.string().required().trim(),
  });

  useEffect(() => {
    dispatch(getacknowledgeTicket({ currentPage: 1 }));
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
    if (SearchData) {
      dispatch(
        getacknowledgeTicket({
          currentPage,
          search: SearchData ? SearchData.search : "",
        })
      );
    } else {
      dispatch(getacknowledgeTicket({ currentPage }));
    }
  };

  const submitForm = (data) => {
    setSearchData({ ...data });
    dispatch(
        getacknowledgeTicket({ search: data.search })
    );
  };

  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

  return (
    <div>
      <div className="container-fluid min-vh-100">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>Tickets Acknowledged To You</h3>
            <div className="d-flex">
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
                  <th scope="col">Options</th>
                </tr>
              </thead>
              <tbody>
                {acknowledgeticket.map((all, index) => (
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
                      <td>{all.Category && all.Category.Name}</td>
                      <td>{all.branch && all.branch.BranchName}</td>
                      <td>{all.User}</td>
                      <td>{all.Assign_User}</td>
                      <td>{all.departments && all.departments.Name}</td>
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

export default TicketAcknowledge;
