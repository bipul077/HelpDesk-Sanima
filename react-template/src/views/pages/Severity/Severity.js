import React,{useState,useEffect} from "react";
import AddSeverity from "./AddSeverity";
import UpdateSeverity from "./UpdateSeverity";
import { getSeverity,deleteSeverity } from "src/store/SeveritySlice";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify';
import { showLoader,hideLoader } from "src/store/ApplicationSlice";
import DeleteModal from "../Category/DeleteModal";
import { clearSeverityError } from "src/store/SeveritySlice";

const Severity = () => {
    const dispatch = useDispatch();
    const {severities,severityloading,severityerror} = useSelector((state)=>(state.severity))
    const [updatedata, setupdatedata] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setshowDeleteModal] = useState(false);
    const [deleteid, setdeleteid] = useState();
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleCloseDeleteModal = () => setshowDeleteModal(false);

    useEffect(() => {
      dispatch(getSeverity());
    }, [dispatch]);
  
    useEffect(() => {
      if(severityerror){
        toast.error(severityerror);
        dispatch(clearSeverityError());
      }
    }, [severityerror,dispatch]);
  
    if (severityloading === true) {
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

  return (
    <>
    <AddSeverity showModal={showModal} handleCloseModal={handleCloseModal}/>
    <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deleteSeverity({ id: deleteid, toast }))}
      />
    {updatedata &&<UpdateSeverity showModal={showUpdateModal} handleCloseModal={handleUpdateCloseModal} preloadedData={updatedata}/>}
    <div className="container-fluid min-vh-100">
      <div className="card w-100">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>
            <i>Severity</i>
          </h3>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
          >
            Add Severity
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped text-center table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Severity Name</th>
                  <th scope="col">Duration (Mins)</th>
                  <th scope="col">CreatedBy</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                    {severities.map((all, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{all.Name}</td>
                          <td>{all.Duration}</td>
                          <td>
                            {all.CreatedBy}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-info"
                              title="Edit"
                              onClick={() => handleUpdateOpenModal(all)}
                            ><i className="fa fa-edit"></i></button>
                            <button
                              className="btn btn-sm btn-danger ml-2"
                              title="Delete"
                              onClick={() => handleOpenDeleteModal(all)}
                            ><i className="fa fa-trash"></i></button> 
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Severity;
