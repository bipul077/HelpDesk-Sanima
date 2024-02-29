import React from "react";

const Fileinput = ({ register,name }) => {
  return (
    <div className="form-group d-flex">
      <label htmlFor="inputField" className="col-sm-3">
        <strong>Select File [Max:5mb]</strong>
      </label>
      <div className="col-sm-3">
        <input
          className="form-control p-1"
          {...register(name)}
          type="file"
          id={name}
        />
      </div>
    </div>
  );
};

export default Fileinput;
