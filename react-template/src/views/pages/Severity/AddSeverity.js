import React from 'react';
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
  import { addSeverity } from 'src/store/SeveritySlice';
  import { toast } from "react-toastify";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";

const AddSeverity = ({ showModal, handleCloseModal}) => {
    const dispatch = useDispatch();
    const schema = yup.object().shape({
        severity: yup
          .string()
          .required("Severity Name is required").trim(),
        duration: yup.string().required("Duration is required")
      });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm({
        resolver: yupResolver(schema),
      });

      const submitForm = async (data) => {
        // console.log(data);
        dispatch(
            addSeverity({
            name: data.severity,
            duration: data.duration,
            toast
          })
        );
        handleCloseModal();
        reset();
      };
    

  return (
    <div>
       <div>
      <CModal
        show={showModal}
        onClose={handleCloseModal}
        style={{ zIndex: 10000 }}
        size=""
      >
        <CModalHeader onClose={false}>
          <CModalTitle>
            <i>Add Severity</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form 
          onSubmit={handleSubmit(submitForm)}
          >
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Severity Name</strong>
              </label>
              <br />
              <div className="col-md-8">
                <input className="form-control" {...register("severity")} />
                <i className="text-danger">{errors.severity?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label className="col-md-4">
                <strong>Response Time (Minutes)</strong>
              </label>
              <div className="col-md-8">
              <input className="form-control" placeholder='In Minutes' type="number" id="quantity" name="quantity" step="1" {...register("duration")}/>
                <i className="text-danger">{errors.duration?.message}</i>
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
    </div>
  )
}

export default AddSeverity
