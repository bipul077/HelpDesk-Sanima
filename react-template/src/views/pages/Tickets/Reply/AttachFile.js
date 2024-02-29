import React from "react";

const AttachFile = ({ register,name }) => {
  return (
    <div className="form-group d-flex">
      <label htmlFor="inputField" className="col-sm-3">
        <strong>Attach File [Max:5mb]</strong>
      </label>
      <div className="col-sm-6">
        <input
          className="form-control"
          {...register(name)}
          type="file"
          id={name}
        />
      </div>
    </div>
  );
};

export default AttachFile;

