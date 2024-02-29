import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "src/store/ApplicationSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ticketbystaff } from "src/store/ReportSlice";
import { verifyrole } from "src/store/LoginSlice";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { clearReportError } from "src/store/ReportSlice";

const Ticketsolvedbystaff = () => {
  const dispatch = useDispatch();
  const { ticketsolvebystaff, reportloading, reporterror } = useSelector(
    (state) => state.report
  );
  const [data, setData] = useState();
  const [report, setreport] = useState(false);

  useEffect(() => {
    dispatch(verifyrole({ role: "verifytm" }));
  }, [dispatch]);

  useEffect(() => {
    if(reporterror){
      toast.error(reporterror);
      dispatch(clearReportError());
    }
  }, [reporterror,dispatch]);

  if (reportloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const schema = yup.object().shape({
    startdate: yup.string().required("Start Date is Required"),
    enddate: yup.string().required("End Date is Required"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    setData({ ...data });
    setreport(true);
    dispatch(
      ticketbystaff({ startdate: data.startdate, enddate: data.enddate })
    );
  };

  const datas = ticketsolvebystaff.map((all,index) => ({
    "#": index+1,
    "User": all.Assign_User,
    "Tickets Solved": all.ticketsolved
  }));

  return (
    <>
      <div className="card">
        <div className="card-header text-center">
          <strong>Tickets Solved By Staff</strong>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group">
                  <label>
                    <i>Input Date From</i>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    {...register("startdate")}
                  />
                  <i className="text-danger">{errors.startdate?.message}</i>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <label>
                    <i>Input Date To</i>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    {...register("enddate")}
                  />
                  <i className="text-danger">{errors.enddate?.message}</i>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div>
                <button className="btn btn-primary" type="submit">
                  Display Report
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {report && (
        <div className="card">
          <div className="card-header text-center">
            <strong>
              Displaying from {data.startdate} to {data.enddate}
            </strong>
            <CSVLink
              data={datas}
              filename={`Report.csv`}
              className="btn btn-dark float-right"
              target="_blank"
              title="Export to CSV"
            >
              <i className="fa fa-download" aria-hidden="true"></i>
            </CSVLink>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped text-center table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Tickets Solved</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsolvebystaff.map((all, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{all.Assign_User}</td>
                        <td>{all.ticketsolved}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ticketsolvedbystaff;
