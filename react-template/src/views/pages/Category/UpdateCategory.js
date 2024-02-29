import React, { useEffect } from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useForm, useController } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateCategory,clearCatError } from "src/store/CategorySlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";
import { clearticketError } from "src/store/TicketSlice";
import Select from "react-select";

const UpdateCategory = ({ showModal, handleCloseModal, preloadedData }) => {
  const dispatch = useDispatch();
  const { department, ticketloading, ticketerror } = useSelector((state) => state.ticket);
  const { catloading, caterror } = useSelector((state) => state.category);

  const schema = yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    department: yup.string().required(),
    description: yup.string().required("Description is required"),
  });

  useEffect(() => {
    if(ticketerror){
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror,dispatch]);

  useEffect(() => {
    if(caterror){
      toast.error(caterror);
      dispatch(clearCatError());
    }
  }, [caterror,dispatch]);

  if (ticketloading === true || catloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("title", preloadedData.Name);
    setValue("department", preloadedData.Department_id);
    setValue("description", preloadedData.Description);
  }, [setValue, preloadedData]);

  const {
    field: { value: deptValue, onChange: deptOnChange, ...restDeptField },
  } = useController({ name: "department", control });

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(
      updateCategory({
        id: preloadedData.id,
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
            <i>Update Category</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Category Name </strong>
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
                  placeholder="Select Parent Category"
                  value={
                    deptValue
                      ? department.find((x) => x.value === deptValue)
                      : department.find(
                          (option) =>
                            option.value === preloadedData.Department_id
                        ) //gives the label and value(object) after it matches the condition
                  }
                  onChange={(option) =>
                    deptOnChange(option ? option.value : option)
                  }
                  {...restDeptField}
                />
              </div>
            </div>
            <CButton color="primary" className="float-right" type="submit">
              Update Category
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

export default UpdateCategory;
