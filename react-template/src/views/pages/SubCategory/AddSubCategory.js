import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { addSubCategory, SpecificCategory } from "src/store/CategorySlice";
import { getDepartment, getSeverity } from "src/store/TicketSlice";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";

const AddSubCategory = ({ showModal, handleCloseModal }) => {
  const dispatch = useDispatch();
  const { category, severity, department } = useSelector((state) => ({
    ...state.ticket,
    ...state.category,
  }));

  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategory, setSubCategory] = useState(null);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getSeverity());
  }, [dispatch]);

  useEffect(() => {
    if (category && category.length > 0) {
      const transformedOptions = category.map((option) => ({
        label: option.Name,
        value: option.id,
      }));
      setCategoryOption(transformedOptions);
    }
  }, [category]);

  useEffect(() => {
    // simulate async api call with set timeout
    setSubCategory({
      title: "",
      department: "",
      description: "",
      subcategory: "",
      severity: "",
    });
  }, []);

  // effect runs when user state is updated
  useEffect(() => {
    reset(subCategory); // reset form with category data
  }, [subCategory]);

  const schema = yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    department: yup.string().required("Department is required"),
    description: yup.string().required("Description is required"),
    subcategory: yup.string().required("Parent Category is required")
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

  const {
    field: { value: catValue, onChange: catOnChange, ...restCatField },
  } = useController({ name: "subcategory", control });

  const {
    field: { value: sevValue, onChange: sevOnChange, ...restsevField },
  } = useController({ name: "severity", control });

  const handleDeptChange = async (e) => {
    setCategoryOption([]);
    catOnChange(null);
    dispatch(SpecificCategory({ Department: e.value }));
    deptOnChange(e ? e.value : e);
  };

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(
        addSubCategory({
        Name: data.title,
        Description: data.description,
        Subcategory: data.subcategory,
        severity: data.severity,
        toast,
      })
    );
    handleCloseModal();
    reset();
    deptOnChange(null);
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
            <i>Add SubCategory</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Sub Category Name *</strong>
              </label>
              <br />
              <div className="col-md-8">
                <input className="form-control" {...register("title")} />
                <i className="text-danger">{errors.title?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label className="col-md-4">
                <strong>Sub Category Description *</strong>
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
                      : deptValue
                  }
                  onChange={handleDeptChange}
                  // onChange={(option) =>
                  //   deptOnChange(option ? option.value : option)
                  // }
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
                    catValue
                      ? categoryOption.find((x) => x.value === catValue)
                      : catValue
                  }
                  onChange={(option) =>
                    catOnChange(option ? option.value : option)
                  }
                  {...restCatField}
                />
                <i className="text-danger">{errors.subcategory?.message}</i>
              </div>
            </div>
            {[67, 66].includes(deptValue) && (
              <div className="form-group d-flex">
                <label htmlFor="tag" className="col-md-4">
                  <strong>Severity</strong>
                </label>
                <div className="col-md-8">
                  <Select
                    options={severity}
                    placeholder="Select Severity"
                    value={
                      sevValue
                        ? severity.find((x) => x.value === sevValue)
                        : sevValue
                    }
                    onChange={(option) =>
                      sevOnChange(option ? option.value : option)
                    }
                    {...restsevField}
                  />
                  <i className="text-danger">{errors.severity?.message}</i>
                </div>
              </div>
            )}

            <CButton color="primary" className="float-right" type="submit">
              Add SubCategory
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

export default AddSubCategory;
