import React, { useState, useEffect } from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "src/store/CategorySlice";
import { getDepartment } from "src/store/TicketSlice";
// import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";

const AddCategory = ({ showModal, handleCloseModal }) => {
  const dispatch = useDispatch();
  // const [departmentOption, setDepartmentOption] = useState([]);
  const { department } = useSelector((state) => ({
    ...state.ticket,
  }));
  const [category, setCategory] = useState(null);

  useEffect(() => {
    dispatch(getDepartment());
  }, [dispatch]);

  const schema = yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    department: yup.string().required(),
    description: yup.string().required("Description is required"),
  });
  // const editorRef = useRef();
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

  useEffect(() => {
    // simulate async api call with set timeout
    setCategory({ title: "", description: "", department: "" })
  }, []);

  // effect runs when user state is updated
  useEffect(() => {
    reset(category); // reset form with category data
  }, [category]);

  const submitForm = async (data) => {
    // setData({...data})
    //  console.log(data);
    dispatch(
      addCategory({
        Name: data.title,
        Department: data.department,
        Description: data.description,
        toast,
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
        size="lg"
      >
        <CModalHeader onClose={false}>
          <CModalTitle>
            <i>Add Category</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Category Name</strong>
              </label>
              <br />
              <div className="col-md-8">
                <input className="form-control" {...register("title")} />
                <i className="text-danger">{errors.title?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label className="col-md-4">
                <strong>Category Description</strong>
              </label>
              <div className="col-md-8">
                <input className="form-control" {...register("description")} />
                <i className="text-danger">{errors.description?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label htmlFor="tag" className="col-md-4">
                <strong>Select Department</strong>
              </label>
              <div className="col-md-8">
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

            {/* <input type="submit" /> */}
            <CButton color="primary" className="float-right" type="submit">
              Add Category
            </CButton>
            {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
          </form>
          {/* {data && <p>{data.department}</p>} */}
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

export default AddCategory;
