import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useController } from "react-hook-form";
import Select from "react-select";
import { showLoader, hideLoader } from "src/store/ApplicationSlice";
import { verifyrole } from "src/store/LoginSlice";
import { sanitize } from "isomorphic-dompurify";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { hrreport } from "src/store/ReportSlice";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";
import { clearReportError } from "src/store/ReportSlice";

const HrReport = () => {
  const dispatch = useDispatch();
  const { reporthr, reportloading, reporterror, reporthrpages, fyOption } =
    useSelector((state) => state.report);
  const [report, setreport] = useState(false);
  const [Data, setData] = useState();

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
    fy: yup.string().required("Fiscal Year is Required"),
    ts: yup.string().required("Ticket Status is Required"),
    row: yup.string().required("No of Row is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(schema) });

  const {
    field: { value: fyValue, onChange: fyOnChange, ...restfyField },
  } = useController({ name: "fy", control });

  const {
    field: { value: tsValue, onChange: tsOnChange, ...resttsField },
  } = useController({ name: "ts", control });

  const {
    field: { value: rowValue, onChange: rowOnChange, ...restrowField },
  } = useController({ name: "row", control });

  const statusOption = [
    {
      label: "Closed",
      value: "Closed",
    },
    { label: "Non Closed", value: "Non Closed" },
  ];

  const rowOption = [
    { label: "All", value: "9999999" },
    {
      label: "100",
      value: "100",
    },
    { label: "200", value: "200" },
    { label: "300", value: "300" },
    { label: "400", value: "400" },
    { label: "500", value: "500" },
  ];

  const removeImagesFromContent = (content) => {
    return sanitize(content.replace(/<img.*?>/g, "")); // Remove <img> tags from the content
  };

  const submitForm = (data) => {
    //console.log(data)
    setData({ ...data });
    setreport(true);
    dispatch(
      hrreport({
        fiscalyear: data.fy,
        status: data.ts,
        row: data.row,
      })
    );
  };

  const extractTextFromHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const datas = reporthr.map((all) => ({
    "Ticket ID": all.id,
    "Staff ID": all.StaffId,
    "Requested By": all.User,
    "Ticket Category": all.Category ? all.Category.Name : "",
    "Ticket Sub Category": all.SubCategory ? all.SubCategory.Name : "NULL",
    "Requested Date": new Date(all.createdAt).toLocaleString(),
    ...(all.Ticket_Status === "Closed" ? {
      "Closed Date": new Date(all.updatedAt).toLocaleString(),
      "Closed By": all.Assign_User 
    }:{"Assigned_To":all.Assign_User || "NULL"}),
    "Current Status": all.Ticket_Status,
    "Ticket Body": extractTextFromHTML(all.Ticket_Body),
  }));

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    dispatch(
      hrreport({
        currentPage,
        startdate: Data.fy.startdate,
        enddate: Data.fy.enddate,
        status: Data.ts,
        row: Data.row,
      })
    );
  };

  return (
    <div>
      <div className="card">
        <div className="card-header text-center">
          <strong>Report</strong>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="row">
              <div className="col-sm-4">
                <strong>Fiscal Year</strong>
                <Select
                  options={fyOption}
                  placeholder="Select Fiscal Year"
                  onChange={(option) =>
                    fyOnChange(option ? option.value : option)
                  }
                  {...restfyField}
                />
                <i className="text-danger">{errors.fy?.message}</i>
              </div>
              <div className="col-sm-4">
                <strong>Ticket Status</strong>
                <Select
                  options={statusOption}
                  placeholder="Select Status"
                  onChange={(option) =>
                    tsOnChange(option ? option.value : option)
                  }
                  {...resttsField}
                />
                <i className="text-danger">{errors.ts?.message}</i>
              </div>
              <div className="col-sm-4">
                <strong>No of Rows</strong>
                <Select
                  options={rowOption}
                  placeholder="Select no.of rows"
                  onChange={(option) =>
                    rowOnChange(option ? option.value : option)
                  }
                  {...restrowField}
                />
                <i className="text-danger">{errors.row?.message}</i>
              </div>
            </div>
            <div className="col-sm-3 mt-3">
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
              Displaying {Data.ts} ticket from {Data.fy.startdate} to{" "}
              {Data.fy.enddate}
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
              <table className="table table-striped table-bordered text-center">
                <thead>
                  <tr>
                    <th scope="col">Ticket ID</th>
                    <th scope="col">Staff ID</th>
                    <th scope="col">Requested By</th>
                    <th scope="col">Ticket Category</th>
                    <th scope="col">Ticket Sub Category</th>
                    <th scope="col">Requested Date</th>
                    {Data.ts === "Closed" ? (
                      <>
                        <th scope="col">Closed Date</th>
                        <th scope="col">Closed By</th>
                      </>
                    ) : (
                      <th scope="col">Assigned To</th>
                    )}
                    <th scope="col">Current Status</th>
                    <th scope="col">Ticket Body</th>
                  </tr>
                </thead>
                <tbody>
                  {reporthr.map((all, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th scope="row">{all.id}</th>
                        <td>{all.StaffId}</td>
                        <td>{all.User}</td>
                        <td>{all.Category && all.Category.Name}</td>
                        <td>
                          {all.SubCategory ? all.SubCategory.Name : "NULL"}
                        </td>
                        <td>{new Date(all.createdAt).toLocaleString()}</td>
                        {Data.ts === "Closed" ? (
                          <>
                            <td>{new Date(all.updatedAt).toLocaleString()}</td>
                            <td>{all.Assign_User}</td>
                          </>
                        ) : (
                          <td>{all.Assign_User || "NULL"}</td>
                        )}

                        <td>{all.Ticket_Status}</td>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: removeImagesFromContent(all.Ticket_Body),
                            }}
                          ></div>
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
              pageCount={reporthrpages}
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
      )}
    </div>
  );
};

export default HrReport;
