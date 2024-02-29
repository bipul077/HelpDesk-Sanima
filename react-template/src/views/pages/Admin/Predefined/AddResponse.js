import React,{useEffect,useState} from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useForm,useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import { addpredefined } from "src/store/PredefinedSlice";
import { toast } from "react-toastify";
import * as yup from "yup";
import Select from "react-select";

const AddResponse = ({ showModal, handleCloseModal,department }) => {
  const dispatch = useDispatch();
  const [data, setdata] = useState(null);

  const schema = yup.object().shape({
    department: yup.string().required("Department is required"),
    response: yup.string().required("Predefined Response is Required").trim()
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
  } = useController({ name: "department", control });

   useEffect(() => {//for reseting fields
      setdata({ response: "",department:"" })
  }, []);

  // effect runs when data state is updated
  useEffect(() => {
    reset(data); // reset form with category data
  }, [data]);

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(addpredefined({ toast, department: data.department,prereply:data.response }));
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
              <i>Add Response</i>
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
                  placeholder="Select Department"
                  value={
                    deptValue
                      ? department.find((x) => x.value === deptValue)
                      : deptValue
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
              Add Response
            </CButton>
          </CModalFooter>
        </CModal>
      </form>
    </div>
  );
};

export default AddResponse;
