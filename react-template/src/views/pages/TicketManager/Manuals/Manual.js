import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";
import { getManual, deleteManual,clearManualError } from "src/store/ManualSlice";
import AddManual from "./AddManual";
import DeleteModal from "../../Category/DeleteModal";
import UpdateManual from "./UpdateManual";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { getDepartment } from "src/store/TicketSlice";
import { clearticketError } from "src/store/TicketSlice";

const Manual = () => {
  const dispatch = useDispatch();
  const { manual, manualloading, manualerror, manualpage } = useSelector(
    (state) => state.manual
  );
  const {department,ticketloading,ticketerror} = useSelector((state)=>(state.ticket));

  const [deptdrop, setDeptdrop] = useState({
    label: "Department",
    value: "",
  });
  const [SearchData, setSearchData] = useState();
  const [updatedata, setupdatedata] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteid, setdeleteid] = useState();
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseDeleteModal = () => setshowDeleteModal(false);

  useEffect(() => {
    if(manualerror){
      toast.error(manualerror);
      dispatch(clearManualError());
    }
  }, [manualerror,dispatch]);

  useEffect(() => {
    if(ticketerror){
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror,dispatch]);

  useEffect(() => {
    dispatch(getManual({ currentPage: 1 }));
    dispatch(getDepartment());
  }, [dispatch]);

  if (manualloading === true || ticketloading === true ) {
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
  const handleUpdateCloseModal = () => setShowUpdateModal(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleView = (file) => {
    const url = process.env.REACT_APP_API_URL + file;
    window.open(url, "_blank");
  };

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    if (SearchData || deptdrop.value ) {
      dispatch(
        getManual({ currentPage, search: SearchData ? SearchData.search : "",department: deptdrop.value })
      );
    } else {
      dispatch(getManual({ currentPage }));
    }
  };

  const handledeptChange = async(eventKey, label)=>{
    setDeptdrop({ label, value: eventKey });
    dispatch(
      getManual({
        currentPage: 1,
        department: eventKey,
      })
    );
  }

  const { register, handleSubmit } = useForm();

  const submitForm = (data) => {
    setSearchData({ ...data });
    dispatch(
      getManual({
        department: deptdrop.value,
        search: data.search
      })
    );
  };

  return (
    <>
      {updatedata && (
        <UpdateManual
          showModal={showUpdateModal}
          handleCloseModal={handleUpdateCloseModal}
          preloadedData={updatedata}
        />
      )}
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteManual({ id: deleteid, toast }))}
      />

      <AddManual showModal={showModal} handleCloseModal={handleCloseModal} />
      <div className="container-fluid min-vh-100">
        <div className="card w-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>
              <i>Manuals</i>
            </h3>
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
                className="form-inline mr-2 ml-2"
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
                className="btn btn-primary"
                onClick={() => handleOpenModal()}
              >
                Add Manual
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped text-center table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Manual File Name</th>
                    <th scope="col">Department</th>
                    <th scope="col">CreatedBy</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {manual.map((all, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{all.Manual_File_Name}</td>
                        <td>{all.departments && all.departments.Name}</td>
                        <td>{all.Created_By}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => {
                              handleView(all.Manual_File);
                            }}
                          >
                            View
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
              pageCount={manualpage}
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
    </>
  );
};

export default Manual;
