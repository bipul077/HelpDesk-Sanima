import React,{useState,useEffect} from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updatepredefined } from "src/store/PredefinedSlice";
import * as yup from "yup";
import Select from "react-select";

const UpdateResponse = ({
  showModal,
  handleCloseModal,
  department,
  preloadedData,
}) => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    department: yup.string().required("Department is required"),
    response: yup.string().required("Predefined Response is Required").trim(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("department", preloadedData.Department_id);
    setValue("response", preloadedData.Prereply);
  }, [setValue,preloadedData]);

  const {
    field: { value: deptValue, onChange: deptOnChange, ...restDeptField },
  } = useController({ name: "department", control });

  const submitForm = async (data) => {
    console.log(data);
    dispatch(
      updatepredefined({
        toast,
        department: data.department,
        prereply: data.response,
        id: preloadedData.id
      })
    );
    reset();
    handleCloseModal();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)}>
        <CModal
          show={showModal}
          onClose={handleCloseModal}
          style={{ zIndex: 10000 }}
          size="md"
        >
          <CModalHeader onClose={false}>
            <CModalTitle>
              <i>Update Response</i>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="form-group d-flex">
              <label htmlFor="inputField" className="col-sm-3">
                <strong>Select Department</strong>
              </label>
              <div className="col-sm-9">
              <Select        
                options={department}
                placeholder="Select Parent Category"
                value={
                  deptValue
                    ? department.find((x) => x.value === deptValue)
                    : department.find((option) => option.value === preloadedData.Department_id)//gives the label and value(object) after it matches the condition
                } 
                onChange={(option) =>         
                  deptOnChange(option ? option.value : option)
                }
                {...restDeptField}             
              />
                <i className="text-danger">{errors.department?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label className="col-sm-3">
                <strong>Predefined Response</strong>
              </label>
              <div className="col-sm-9">
                <input className="form-control" {...register("response")} />
                <i className="text-danger">{errors.response?.message}</i>
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseModal}>
              Close
            </CButton>
            <CButton color="primary" className="float-right" type="submit">
              Update
            </CButton>
          </CModalFooter>
        </CModal>
      </form>
    </div>
  );
};

export default UpdateResponse;
