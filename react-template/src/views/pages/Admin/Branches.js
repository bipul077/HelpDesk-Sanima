import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBranches, syncBranches } from "src/store/BranchSlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";

const Branches = () => {
  const dispatch = useDispatch();
  const { branches, branchloading, brancherror } = useSelector((state) => state.branch);

  useEffect(() => {
    dispatch(getBranches());
  }, [dispatch]);

  useEffect(() => {
    brancherror && toast.error(brancherror);
  }, [brancherror]);

  if (branchloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  return (
    <div className="container-fluid min-vh-100">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="card w-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>
                  <i>Branches</i>
                </h3>
                <button
                  className="btn btn-primary"
                  onClick={() => dispatch(syncBranches({ toast }))}
                >
                  Sync Branch
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped text-center table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Branch ID</th>
                        <th scope="col">Branch Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.map((all, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{all.BranchID}</td>
                            <td>{all.BranchName}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;
