import React from "react";
import Select from "react-select";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { addaccesscontrols } from "src/store/AccessSlice";
import {toast} from 'react-toastify';

const Job = ({ department }) => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    jobid: yup.string().required("JOBID is required"),
    dept: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required("Label is required"),
        value: yup.string().required("Value is required"),
      })
    )
    .required("Department is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    field: { value: deptValue, onChange: deptOnChange, ...restDeptField },
  } = useController({ name: "dept", control });

  const submitForm = async (data) => {
    const selectedDeptValues = data.dept.map((option) => option.value);
    // console.log(data.staffname, selectedDeptValues);
    dispatch(addaccesscontrols({ toast, jobid: data.jobid,accesstodept:selectedDeptValues }));
    reset();
    deptOnChange(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)}>
      <div className="mb-2">
        <input
          className="form-control"
          type="text"
          {...register("jobid")}
          placeholder="Enter JOB ID"
        />
        <i className="text-danger">{errors.jobid?.message}</i>
      </div>
      <div>
        <Select
          isMulti
          options={department}
          placeholder="Select Department"
          value={deptValue}
          onChange={(option) => deptOnChange(option)}
          {...restDeptField}
        />
        <i className="text-danger">{errors.dept?.message}</i>
      </div>
      <div className="float-right mt-1">
        <button className="btn btn-sm btn-primary" type="submit">
          Submit
        </button>
      </div>
      </form>
    </div>
  );
};

export default Job;
