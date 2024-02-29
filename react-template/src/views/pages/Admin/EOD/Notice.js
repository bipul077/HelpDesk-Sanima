import React, { useState, useEffect } from "react";
import { useForm, useController } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addnotice,clearEodError } from "src/store/EodSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getnotice, deletenotice } from "src/store/EodSlice";
import { sanitize } from "isomorphic-dompurify";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import DeleteModal from "../../Category/DeleteModal";
const Editor = React.lazy(() => import("../../editor/Editor"));

const Notice = () => {
  let sanitizedHtml;
  const dispatch = useDispatch();
  const { notice, eodloading, eoderror } = useSelector((state) => state.eod);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteid, setdeleteid] = useState();
  const [key, setKey] = useState(0);
  const schema = yup.object().shape({
    Notice: yup.string().required("Notice is required"),
  });

  useEffect(() => {
    dispatch(getnotice());
  }, [dispatch]);

  useEffect(() => {
    if(eoderror){
      toast.error(eoderror);
      dispatch(clearEodError());
    }
  }, [eoderror,dispatch]);

  if (eodloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  if (notice) {
    sanitizedHtml = sanitize(notice.Content);
  }

  const handleOpenDeleteModal = (id) => {
    setdeleteid(id);
    setshowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setshowDeleteModal(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { field } = useController({
    name: "Notice",
    control,
    defaultValue: "", // Initial value for the CKEditor content
  });

  const submitForm = async (data) => {
    dispatch(addnotice({ toast, Content: data.Notice }));
    setKey((prevKey) => prevKey + 1);
    reset();
  };

  return (
    <div>
      <DeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseDeleteModal}
        method={() => dispatch(deletenotice({ id: deleteid, toast }))}
      />
      <div className="container-fluid min-vh-100">
        <div className="card">
          <div className="card-header">
            <h3>
              <i>Add EOD Notice</i>
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(submitForm)}>
              <Editor
                content={"Write the eod notice here ..."}
                onChange={field.onChange}
                key={key}
              />
              <i className="text-danger">{errors.Notice?.message}</i>
              <button
                className="btn btn-primary float-right mt-1"
                type="submit"
              >
                Add
              </button>
            </form>
          </div>
        </div>
        <div className="card">
          <div className="card-header text-center">
            <h3>EOD Notice</h3>
          </div>
          <div className="card-body text-center">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" className="col-md-8">
                    Content
                  </th>
                  <th scope="col">Created_By</th>
                  <th scope="col">Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              {notice &&
                Object.keys(notice).length !== 0 && ( //checks whether the notice object has any keys
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <div
                          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                          style={{
                            maxWidth: "650px",
                            maxHeight: "400px",
                            overflow: "auto",
                          }}
                        ></div>
                      </td>
                      <td>{notice.Created_By}</td>
                      <td>{new Date(notice.updatedAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleOpenDeleteModal(notice.id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
