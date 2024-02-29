import React, { useState, useEffect } from "react";
import AddSubCategory from "./AddSubCategory";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { getSubCategory, deleteSubCategory,clearCatError } from "src/store/CategorySlice";
import CIcon from "@coreui/icons-react";
import { toast } from "react-toastify";
import DeleteModal from "../Category/DeleteModal";
import UpdateSubCategory from "./UpdateSubCategory";
import ReactPaginate from "react-paginate";
import { freeSet } from "@coreui/icons";
import { clearticketError } from "src/store/TicketSlice";

const SubCategory = () => {
  const dispatch = useDispatch();
  const { subcategory, catloading, caterror, subcategorypage } = useSelector(
    (state) => state.category
  );
  const {ticketloading,ticketerror} = useSelector(
    (state) => state.ticket
  );
  const [updatedata, setupdatedata] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteid, setdeleteid] = useState();
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseDeleteModal = () => setshowDeleteModal(false);

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

  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };

  const handleUpdateOpenModal = (all) => {
    setupdatedata(all);
    setShowUpdateModal(true);
  };
  const handleUpdateCloseModal = () => setShowUpdateModal(false);

  useEffect(() => {
    dispatch(getSubCategory({ currentPage: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if(caterror){
      toast.error(caterror);
      dispatch(clearCatError());
    }
  }, [caterror]);

  if (catloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    dispatch(getSubCategory({ currentPage }));
  };

  return (
    <>
      <AddSubCategory
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteSubCategory({ id: deleteid, toast }))}
      />
      {updatedata && (
        <UpdateSubCategory
          showModal={showUpdateModal}
          handleCloseModal={handleUpdateCloseModal}
          preloadedData={updatedata}
        />
      )}

      <div className="container-fluid min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="card w-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3>
                    <i>Sub Categories</i>
                  </h3>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenModal()}
                  >
                    Add SubCategory
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped text-center table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Parent Category</th>
                          <th scope="col">Department</th>
                          <th scope="col">Severity</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subcategory.map((all, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td>{all.Name}</td>
                              <td>{all.Category && all.Category.Name}</td>
                              <td>
                                {all.Category && all.Category.departments.Name}
                              </td>
                              <td>{all.severity && all.severity.Name}</td>
                              <td>
                                <CIcon
                                  content={freeSet.cilSettings}
                                  title="Edit"
                                  customClasses="c-sidebar-nav-icon"
                                  onClick={() => handleUpdateOpenModal(all)}
                                />
                                <CIcon
                                  content={freeSet.cilTrash}
                                  title="Delete"
                                  customClasses="c-sidebar-nav-icon ml-2"
                                  onClick={() => handleOpenDeleteModal(all)}
                                />
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
                    pageCount={subcategorypage}
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
    </>
  );
};

export default SubCategory;
