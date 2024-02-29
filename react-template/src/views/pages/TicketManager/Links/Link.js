import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLink, deleteLink,clearLinkError } from "src/store/LinkSlice";
import { toast } from "react-toastify";
import { showLoader, hideLoader } from "src/store/ApplicationSlice";
import AddLink from "./AddLink";
import UpdateLink from "./UpdateLink";
import DeleteModal from "../../Category/DeleteModal";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { getDepartment } from "src/store/TicketSlice";
import { clearticketError } from "src/store/TicketSlice";

const Link = () => {
  const dispatch = useDispatch();
  const { link, linkloading, linkerror, linkpage } = useSelector(
    (state) => state.link
  );
  const { department, ticketloading, ticketerror } = useSelector(
    (state) => state.ticket
  );

  const [deptdrop, setDeptdrop] = useState({
    label: "Department",
    value: "",
  });
  const [SearchData, setSearchData] = useState();
  const [updatedata, setupdatedata] = useState(null);
  const [deleteid, setdeleteid] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getLink({ currentPage: 1 }));
    dispatch(getDepartment());
  }, [dispatch]);

  useEffect(() => {
    if(linkerror){
      toast.error(linkerror);
      dispatch(clearLinkError());
    }
  }, [linkerror,dispatch]);

  useEffect(() => {
    if(ticketerror){
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror,dispatch]);

  if (linkloading === true || ticketloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };

  const handleUpdateOpenModal = (all) => {
    setupdatedata(all);
    setShowUpdateModal(true);
  };
  const handleCloseDeleteModal = () => setshowDeleteModal(false);
  const handleUpdateCloseModal = () => setShowUpdateModal(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    if (SearchData || deptdrop.value ) {
      dispatch(
        getLink({ currentPage, search: SearchData ? SearchData.search : "",department: deptdrop.value })
      );
    } else {
      dispatch(getLink({ currentPage }));
    }
  };

  const handledeptChange = async(eventKey, label)=>{
    setDeptdrop({ label, value: eventKey });
    dispatch(
      getLink({
        currentPage: 1,
        department: eventKey,
      })
    );
  }

  const submitForm = (data) => {
    setSearchData({ ...data });
    dispatch(
      getLink({
        department: deptdrop.value,
        search: data.search,
      })
    );
  };

  const { register, handleSubmit } = useForm();

  return (
    <div>
      {updatedata && (
        <UpdateLink
          showModal={showUpdateModal}
          handleCloseModal={handleUpdateCloseModal}
          preloadedData={updatedata}
        />
      )}
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteLink({ id: deleteid, toast }))}
      />
      <AddLink showModal={showModal} handleCloseModal={handleCloseModal} />
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <i>
            <h4>App Links</h4>
          </i>
          <div className="d-flex">
            <DropdownButton
              id="dropdown-basic-button"
              title={deptdrop.label}
              variant="dark"
              onSelect={(eventKey, event) =>
                handledeptChange(eventKey, event.target.textContent)
              }
            >
              {department.map((x, index) => (
                <Dropdown.Item key={index} eventKey={x.value}>
                  {x.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <form
              className="form-inline ml-2 mr-2"
              onSubmit={handleSubmit(submitForm)}
            >
              <input
                className="form-control"
                type="search"
                placeholder="Search manuals"
                {...register("search")}
              />
              <button className="btn btn-success" type="submit">
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </form>
            <button
              className="btn btn-primary float-right"
              onClick={() => handleOpenModal()}
            >
              Add Link
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped text-center table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Application Name</th>
                  <th scope="col">Department</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {link.map((all, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{all.App_Name}</td>
                      <td>{all.departments && all.departments.Name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => window.open(all.Link, "_blank")}
                        >
                          Open App
                        </button>
                        <button
                          className="btn btn-sm btn-info ml-2"
                          title="Edit"
                          onClick={() => handleUpdateOpenModal(all)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger ml-2"
                          title="Delete"
                          onClick={() => handleOpenDeleteModal(all)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={linkpage}
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
  );
};

export default Link;
