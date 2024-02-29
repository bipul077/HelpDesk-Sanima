import React from "react";
import { useState, useEffect } from "react";
import AddResponse from "./AddResponse";
import { useDispatch, useSelector } from "react-redux";
import { getpredefined,deletepredefined,clearPredefinedError } from "src/store/PredefinedSlice";
import DeleteModal from "../../Category/DeleteModal";
import UpdateResponse from "./UpdateResponse";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { getDepartment } from "src/store/TicketSlice";
import ReactPaginate from "react-paginate";


const PredefinedResponse = () => {
  const dispatch = useDispatch();
  const { predefines, loading, error, department,responsepage,predefinedloading,predefinederror } = useSelector((state) => ({
    ...state.predefined,
    ...state.ticket,
  }));
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteid, setdeleteid] = useState();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const handleOpenModal = () => setShowResponseModal(true);
  const handleCloseModal = () => setShowResponseModal(false);
  const [updatedata, setupdatedata] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleUpdateCloseModal = () => setShowUpdateModal(false);
  const handleCloseDeleteModal = () => setshowDeleteModal(false);
  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };
  const handleUpdateOpenModal = (all) => {
    setupdatedata(all);
    setShowUpdateModal(true);
  };
  useEffect(() => {
    dispatch(getpredefined({ currentPage: 1 })); // reset form with category data
    dispatch(getDepartment());
  }, [dispatch]);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  useEffect(() => {
    if(predefinederror){
      toast.error(predefinederror);
      dispatch(clearPredefinedError());
    }
  }, [predefinederror,dispatch]);

  if (loading === true || predefinedloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    dispatch(getpredefined({ currentPage }));
  };

  return (
    <div>
      <AddResponse
        showModal={showResponseModal}
        handleCloseModal={handleCloseModal}
        department={department}
      />
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deletepredefined({ id: deleteid, toast }))}
      />
      {updatedata && (
        <UpdateResponse
          showModal={showUpdateModal}
          handleCloseModal={handleUpdateCloseModal}
          preloadedData={updatedata}
          department={department}
        />
      )}
      <div className="container-fluid min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="card p-3 mb-5">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3>Predefined Response</h3>
                  <div className="d-flex">
                    {/* <h3>Add Tickets</h3> */}

                    <button
                      className="btn btn-primary ml-3"
                      onClick={() => handleOpenModal()}
                    >
                      Add Response
                    </button>
                  </div>
                </div>
                <table className="table table-striped table-bordered text-center">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Department</th>
                      <th scope="col">Predefined Response</th>
                      <th scope="col">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predefines &&
                      predefines.map((data, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{data.departments.Name}</td>
                            <td>{data.Prereply}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleUpdateOpenModal(data)}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger ml-1"
                                onClick={() => handleOpenDeleteModal(data)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
                <div className="card-footer">
                  <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    pageCount={responsepage}
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

export default PredefinedResponse;
