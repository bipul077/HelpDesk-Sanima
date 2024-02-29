import React from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addManual } from "src/store/ManualSlice";
import { toast } from "react-toastify";

const AddManual = ({ showModal, handleCloseModal }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(
        addManual({
        manualfilename: data.manualfilename,
        manualfile: data.manualfile[0],
        toast
      })
    );
    handleCloseModal();
    reset();
  };

  return (
    <div>
      <CModal
        show={showModal}
        onClose={handleCloseModal}
        style={{ zIndex: 10000 }}
        size=""
      >
        <CModalHeader onClose={false}>
          <CModalTitle>
            <i>Add Manual</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Manual File Name</strong>
              </label>
              <br />
              <div className="col-md-8">
                <input
                  className="form-control"
                  {...register("manualfilename", {
                    required: "Manual File name is required",
                    pattern: {
                        value: /\S/, // This regular expression ensures at least one non-whitespace character
                        message: "Manual File name cannot consist of only spaces",
                      },
                  })}
                />
                <i className="text-danger">{errors.manualfilename?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label className="col-md-4">
                <strong>Manual File</strong>
              </label>
              <div className="col-md-8">
                <input
                  {...register("manualfile", {
                    required: "Manual File is required",
                  })}
                  type="file"
                  id="manualfile"
                  className="form-control"
                />
                <i className="text-danger">{errors.manualfile?.message}</i>
              </div>
            </div>
            <CButton color="primary" className="float-right" type="submit">
              Add
            </CButton>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AddManual;
