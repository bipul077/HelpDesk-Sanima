import React, { useEffect } from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import Select from "react-select";
import { useForm, useController } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees, updateaccesscontrols } from "src/store/AccessSlice";
import { getDepartment } from "src/store/AccessSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const UpdateAccessControl = ({
  showModal,
  handleCloseModal,
  argstaff,
  argdept,
  id,
  model,
  job
}) => {
  let schema;
  const dispatch = useDispatch();
  const { employeeoptions, acdepartment } = useSelector((state) => ({
    ...state.accesscontrol
  }));

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getDepartment());
  }, [dispatch]);

  if (model === "STAFF_ID") {
    schema = yup.object().shape({
      staffname: yup.string().required("Staff Name is required"),
      dept: yup
        .array()
        .min(1)
        .of(
          yup.object().shape({
            label: yup.string().required("Label is required"),
            value: yup.string().required("Value is required"),
          })
        )
        .required("Department is required"),
    });
  } else if (model === "JOB_ID") {
    schema = yup.object().shape({    
      jobid: yup.string().required("JOBID is required"),
      dept: yup
        .array()
        .min(1)
        .of(
          yup.object().shape({
            label: yup.string().required("Label is required"),
            value: yup.string().required("Value is required"),
          })
        )
        .required("Department is required"),
    });
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if(model==="STAFF_ID"){
      setValue("staffname", argstaff.value);
    }
    if(model==="JOB_ID"){
      setValue("jobid",argstaff);
    }
  }, [setValue,argstaff]);

  useEffect(() => {
    setValue(
      "dept",
      argdept.map((x) => ({ label: x.label, value: x.value }))
    );
  }, [setValue,argdept]);

  const {
    field: {
      value: staffValue,
      onChange: staffnameOnChange,
      ...reststaffnameField
    },
  } = useController({ name: "staffname", control });

  const {
    field: { value: deptValue, onChange: deptOnChange, ...restDeptField },
  } = useController({ name: "dept", control });

  const submitForm = async (data) => {
    // console.log(data);
    const selectedDeptValues = data.dept.map((option) => option.value);
    if(model==="STAFF_ID")
    {
      dispatch(
        updateaccesscontrols({
          toast,
          id,
          staffid: data.staffname,
          accesstodept: selectedDeptValues,
        })
      );
      staffnameOnChange(null);
    }
    else if(model==="JOB_ID"){
      dispatch(
        updateaccesscontrols({
          toast,
          id,
          jobid: data.jobid,
          accesstodept: selectedDeptValues,
        })
      );
      reset();
    }
    deptOnChange([]);
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
          size=""
        >
          <CModalHeader onClose={false}>
            <CModalTitle>
              <i>Update User Role</i>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {model === "STAFF_ID" ? ( //if model is for staff show staff one if not show job one
              <div className="form-group row">
                <label htmlFor="exampleInputEmail1" className="col-sm-4">
                  <strong>Staff Name</strong>
                </label>
                <br />
                <div className="col-sm-8">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue=""
                    name="staff"
                    options={employeeoptions}
                    placeholder="Select Staff"
                    value={
                      staffValue
                        ? employeeoptions.find((x) => x.value === staffValue)
                        : staffValue
                    }
                    onChange={(option) =>
                      staffnameOnChange(option ? option.value : option)
                    }
                    {...reststaffnameField}
                  />
                  <i className="text-danger">{errors.staffname?.message}</i>
                </div>
              </div>
            ) : (
              <div className="form-group row">
                <label htmlFor="exampleInputEmail1" className="col-sm-4">
                  <strong>JOB ID</strong>
                </label>
                <br />
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="text"
                    {...register("jobid")}
                    placeholder="Enter JOB ID"
                  />
                  <i className="text-danger">{errors.jobid?.message}</i>
                </div>
              </div>
            )}
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Access To Department</strong>
              </label>
              <br />
              <div className="col-sm-8">
                <Select
                  isMulti
                  options={acdepartment}
                  placeholder="Select Department"
                  // value={deptValue}
                  value={
                    deptValue
                      ? deptValue
                      : argdept.map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))
                  }
                  onChange={(option) => deptOnChange(option)}
                  {...restDeptField}
                />
                <i className="text-danger">{errors.dept?.message}</i>
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseModal}>
              Close
            </CButton>
            <CButton color="primary" className="float-right" type="submit">
              Update Role
            </CButton>
          </CModalFooter>
        </CModal>
      </form>
    </div>
  );
};

export default UpdateAccessControl;
