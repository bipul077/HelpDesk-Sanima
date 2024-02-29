import React from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addaccesscontrols } from "src/store/AccessSlice";
import * as yup from "yup";

const Staff = ({employeeoptions,department}) => {
  const dispatch = useDispatch();
  
  const schema = yup.object().shape({
    staffname: yup.string().required("Staff Name is required"),
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
    handleSubmit,
    formState: { errors },
    // reset,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    const selectedDeptValues = data.dept.map((option) => option.value);
    // console.log(data.staffname, selectedDeptValues);
    dispatch(addaccesscontrols({ toast, staffid: data.staffname,accesstodept:selectedDeptValues }));
    staffnameOnChange(null);
    deptOnChange(null);
    // reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mb-2">
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

export default Staff;
