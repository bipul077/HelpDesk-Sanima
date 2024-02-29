import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useForm,useController } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateSubCategory, SpecificCategory } from "src/store/CategorySlice";
import { toast } from "react-toastify";
import Select from "react-select";
import { getSeverity } from "src/store/TicketSlice";

const UpdateSubCategory = ({ showModal, handleCloseModal, preloadedData }) => {
  const dispatch = useDispatch();
  const { department,category,severity } = useSelector((state) => ({
    ...state.ticket,...state.category
  }));
  const [categoryOption, setCategoryOption] = useState([]);

  const schema = yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    department: yup.string().required(),
    description: yup.string().required("Description is required"),
    parentcategory: yup.string().required("Parent Category is required")
  });

  // const DP = [
  //   { value: "IT", label: "IT" },
  //   { value: "HR", label: "HR" },
  //   { value: "GS", label: "GS" },
  // ];



  useEffect(() => {
    if (category && category.length > 0) {
      const transformedOptions = category.map((option) => ({
        label: option.Name,
        value: option.id,
      }));
      setCategoryOption(transformedOptions);
    }
  }, [category]);

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
    setValue("department", preloadedData.Category.Department_id);
    setValue("description", preloadedData.Description);
    setValue("parentcategory", preloadedData.Parent_id);
    setValue("severity", preloadedData.Severity_id);
    dispatch(SpecificCategory({ Department: preloadedData.Category.Department_id }));
    dispatch(getSeverity());
  }, [dispatch,setValue,preloadedData]);

  const handleDeptChange = async (e) => {
    setCategoryOption([]);
    // catOnChange(null);
    // subcatOnChange(null);
    dispatch(SpecificCategory({ Department: e.value }));
    setValue("parentcategory", '');
    deptOnChange(e ? e.value : e);
  };

  const {
    field: { value: deptValue, onChange: deptOnChange, ...restDeptField },
  } = useController({ name: "department", control });

  const {
    field: { value: parentcatValue, onChange: parentcatOnChange, ...restparentcatField },
  } = useController({ name: "parentcategory", control });

  const {
    field: { value: sevValue, onChange: sevOnChange, ...restsevField },
  } = useController({ name: "severity", control });

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(
      updateSubCategory({
        id: preloadedData.id,
        Name: data.title,
        Description: data.description,
        Category_Parent: data.parentcategory,
        severity: data.severity,
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
            <i>Update SubCategory</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Category Name *</strong>
              </label>
              <br />
              <div className="col-md-8">
                <input className="form-control" {...register("title")} />
                <i className="text-danger">{errors.title?.message}</i>
              </div>
            </div>

            <div className="form-group d-flex">
              <label className="col-md-4">
                <strong>Category Description *</strong>
              </label>
              <div className="col-md-8">
                <input className="form-control" {...register("description")} />
                <i className="text-danger">{errors.description?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label htmlFor="tag" className="col-md-4">
                <strong>Select Department *</strong>
              </label>
              <div className="col-md-8">
              <Select
                  options={department}
                  placeholder="Select Department"
                  value={
                    deptValue
                      ? department.find((x) => x.value === deptValue)
                      : department.find((option) => option.value === preloadedData.Category.Department_id)
                  }
                  onChange={handleDeptChange}
                  {...restDeptField}
                />
                <i className="text-danger">{errors.department?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label htmlFor="tag" className="col-md-4">
                <strong>Category Parent *</strong>
              </label>
              <div className="col-md-8">
              <Select        
                options={categoryOption}
                placeholder="Select Parent Category"
                value={
                  parentcatValue
                    ? categoryOption.find((x) => x.value === parentcatValue)
                    : categoryOption.find((option) => option.value === preloadedData.Parent_id)
                } 
                // value={parentcatValue || categoryOption.find((option) => option.value === preloadedData.Parent_id)}
                onChange={(option) =>         
                  parentcatOnChange(option ? option.value : option)
                }
                {...restparentcatField}             
              />
              <i className="text-danger">{errors.parentcategory?.message}</i>
              </div>
            </div>
            {[67, 66].includes(preloadedData.Category.Department_id) && (
            <div className="form-group d-flex">
              <label htmlFor="tag" className="col-md-4">
                <strong>Severity *</strong>
              </label>
              <div className="col-md-8">
              <Select
                  options={severity}
                  placeholder="Select Severity"
                  value={
                    sevValue
                      ? severity.find((x) => x.value === sevValue)
                      : severity.find((option) => option.value === preloadedData.Severity_id)
                  }
                  onChange={(option) =>
                    sevOnChange(option ? option.value : option)
                  }
                  {...restsevField}
                />
              <i className="text-danger">{errors.parentcategory?.message}</i>
              </div>
            </div>
            )}
            <CButton color="primary" className="float-right" type="submit">
              Update SubCategory
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

export default UpdateSubCategory;
