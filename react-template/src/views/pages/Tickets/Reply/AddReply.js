import React, { useState, useEffect } from "react";
import Select from "react-select";
import { decodeToken } from "react-jwt";
import { useForm, useController } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addreply } from "src/store/ViewTicketSlice";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { predefinedticket,clearPredefinedError } from "src/store/PredefinedSlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import AttachFile from "./AttachFile";

const Editor = React.lazy(() => import("../../editor/Editor"));

const AddReply = ({ Ticketdata }) => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const dispatch = useDispatch();
  const { predefineticket, predefinedloading, predefinederror } = useSelector(
    (state) => state.predefined
  );
  const [key, setKey] = useState(0);
  const [fileInputs, setFileInputs] = useState([1]);
  const [selresponse, setselresponse] = useState("");
  useEffect(() => {
    dispatch(predefinedticket());
  }, [dispatch]);

  useEffect(() => {
    if(predefinederror){
      toast.error(predefinederror);
      dispatch(clearPredefinedError());
    }
  }, [predefinederror,dispatch]);

  if (predefinedloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const schema = yup.object().shape({
    Reply: yup.string().required("Reply is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { field } = useController({
    name: "Reply",
    control,
    defaultValue: selresponse, // Initial value for the CKEditor content
  });

  const submitForm = async (data) => {
    console.log(data);
    // dispatch(addreply({ reply: data.Reply, ticket_id: Ticketdata.id, toast }));
    // setKey((prevKey) => prevKey + 1);
    // setselresponse("");
    // reset();
    const formData = new FormData();
    // console.log(data);
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] instanceof FileList) {
        // If the property is a FileList (representing a file input)
        const fileList = data[key];
        // Iterate through the files in the FileList
        for (let i in fileList) {
          const file = fileList[i];
          // Append each file to formData 
          formData.append('Image', file);
        }
      }
    }
    formData.append('Replies',data.Reply);
    formData.append('ticket_id',Ticketdata.id);
    dispatch(addreply({ formData, toast }));
    setKey((prevKey) => prevKey + 1);
    setselresponse("");
    reset();
  };

  const fileclick=(e)=>{
    e.preventDefault()
    setFileInputs((prevInputs) => [...prevInputs, 1]);//pushes 1 to the existing array
  }

  return (
    <div>
      <div className="card p-3">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="reply-ticket">
            <h4>Reply To Ticket</h4>
            <Editor
              content={"Reply here"}
              onChange={field.onChange}
              key={key}
              responsevalue={selresponse}
            />
            <i className="text-danger">{errors.Reply?.message}</i>
          </div>
          <hr />
          {decodedToken &&
          (Ticketdata.Assign_User === decodedToken.data.recordset[0].Username ||
            Ticketdata.User === decodedToken.data.recordset[0].Username) ? (
            <>
              <div className="replyfile">
                {fileInputs.map((x, index) => (
                  <AttachFile
                    key={index}
                    register={register}
                    name={`picture${index + 1}`}
                  />
                ))}
                 <div className="form-group d-flex">
                      <div className="col-sm-3">
                        <button className="btn btn-sm btn-info" onClick={(e)=>fileclick(e)}>
                          Add another file
                        </button>
                      </div>
                    </div>
              </div>
              <hr />
              <div className="pre-response">
                <h5>Pre-defined Response</h5>
                <Select
                  options={predefineticket}
                  placeholder="Select Pre-defined Response"
                  value={
                    selresponse
                      ? predefineticket.find((x) => x.value === selresponse)
                      : selresponse
                  }
                  onChange={(option) =>
                    setselresponse(option ? option.value : option)
                  }
                />
                <button
                  className="btn btn-info mt-2 col-sm-12"
                  disabled={Ticketdata.Ticket_Status === "Closed"}
                  type="submit"
                >
                  Reply
                </button>
              </div>
            </>
          ) : (
            <h4>
              Only Ticket Created Users and Assigned users are allowed to reply
            </h4>
          )}
        </form>
      </div>
    </div>
  );
};
export default AddReply;
