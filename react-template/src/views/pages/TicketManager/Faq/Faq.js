import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getfaq, deletefaq, clearFaqError } from "src/store/FaqSlice";
import AddFaq from "./AddFaq";
import { toast } from "react-toastify";
import { showLoader, hideLoader } from "src/store/ApplicationSlice";
import { sanitize } from "isomorphic-dompurify";
import DeleteModal from "../../Category/DeleteModal";
import UpdateFaq from "./UpdateFaq";
import ReactPaginate from "react-paginate";

const Faq = () => {
  const dispatch = useDispatch();
  const { faq, faqloading, faqerror, faqpage } = useSelector(
    (state) => state.faq
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteid, setdeleteid] = useState();
  const [updatedata, setupdatedata] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseDeleteModal = () => setshowDeleteModal(false);

  useEffect(() => {
    dispatch(getfaq({ currentPage: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if(faqerror){
      toast.error(faqerror);
      dispatch(clearFaqError());
    }
  }, [faqerror,dispatch]);

  if (faqloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenDeleteModal = (all) => {
    setdeleteid(all.id);
    setshowDeleteModal(true);
  };

  const handleUpdateOpenModal = (all) => {
    setupdatedata(all);
    setShowUpdateModal(true);
  };
  const handleUpdateCloseModal = () => setShowUpdateModal(false);

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    dispatch(getfaq({ currentPage }));
  };

  return (
    <>
      {updatedata && (
        <UpdateFaq
          showModal={showUpdateModal}
          handleCloseModal={handleUpdateCloseModal}
          preloadedData={updatedata}
        />
      )}
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deletefaq({ id: deleteid, toast }))}
      />

      <AddFaq showModal={showModal} handleCloseModal={handleCloseModal} />
      <div className="container-fluid min-vh-100">
        <div className="card w-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>
              <i>Frequently Asked Questions</i>
            </h3>
            <button
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              Add FAQ
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped text-center table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Question</th>
                    <th scope="col">Answer</th>
                    <th scope="col">CreatedBy</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faq.map((all, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{all.Question}</td>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: sanitize(all.Answer),
                            }}
                            style={{
                              maxWidth: "650px",
                              maxHeight: "400px",
                              overflow: "auto",
                            }}
                          ></div>
                        </td>
                        <td>{all.Created_By}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info"
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
              pageCount={faqpage}
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

export default Faq;
