import React, { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import { useDispatch, useSelector } from "react-redux";
import { getCategory, deleteCategory,clearCatError } from "src/store/CategorySlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import CIcon from "@coreui/icons-react";
import UpdateCategory from "./UpdateCategory";
import { toast } from "react-toastify";
import DeleteModal from "./DeleteModal";
import ReactPaginate from "react-paginate";
import { freeSet } from "@coreui/icons";

const Categories = () => {
  const dispatch = useDispatch();

  const [updatedata, setupdatedata] = useState(null);
  const { data, catloading, caterror, categorypage } = useSelector(
    (state) => state.category
  );
  const [showModal, setShowModal] = useState(false);
  const [deleteid, setdeleteid] = useState();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCloseDeleteModal = () => setshowDeleteModal(false);
  const handleUpdateOpenModal = (all) => {
    setupdatedata(all);
    setShowUpdateModal(true);
  };

  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };

  // const handleDelete = (all) => {
  //   dispatch(deleteCategory({id:all.id,toast}));
  // }
  const handleUpdateCloseModal = () => setShowUpdateModal(false);

  useEffect(() => {
    //dispatch an action for getCategory
    dispatch(getCategory({ currentPage: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if(caterror){
      toast.error(caterror);
      dispatch(clearCatError());
    }
  }, [caterror,dispatch]);

  if (catloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    dispatch(getCategory({ currentPage }));
  };

  return (
    <>
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteCategory({ id: deleteid, toast }))}
      />
      <AddCategory showModal={showModal} handleCloseModal={handleCloseModal} />
      {updatedata && (
        <UpdateCategory
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
                    <i>Categories</i>
                  </h3>
                  {/* <Button variant="contained" onClick={handleOpenModal}>Add Category</Button> */}
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenModal()}
                  >
                    Add Category
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped text-center table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Department</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((all, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td>{all.Name}</td>
                              <td>{all.departments && all.departments.Name}</td>
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
                    pageCount={categorypage}
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

export default Categories;
