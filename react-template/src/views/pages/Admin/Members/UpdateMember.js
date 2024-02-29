import React, { useEffect, useState } from "react";
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
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import { getroles } from "src/store/UserSlice";
import { updateuser } from "src/store/UserSlice";
import { getEmployees } from "src/store/AccessSlice";
import { SpecificCategory, getCategory } from "src/store/CategorySlice";

const UpdateMember = ({ showModal, handleCloseModal, preloadedData }) => {
  const dispatch = useDispatch();
  const { employeeoptions, roles, department, category } = useSelector(
    (state) => ({
      ...state.user,
      ...state.accesscontrol,
      ...state.ticket,
      ...state.category,
    })
  );
  const [userOption, setUserOption] = useState([]);
  const [categoryOption, setCategoryOption] = useState([]);

  useEffect(() => {
    if (roles && roles.length > 0) {
      const transformedOptions = roles.map((option) => ({
        label: option.RoleName,
        value: option.id,
      }));
      setUserOption(transformedOptions);
    }
    if (category && category.length > 0) {
      const catOptions = category.map((option) => ({
        label: option.Name,
        value: option.id,
      }));
      setCategoryOption(catOptions);
    }
  }, [roles, category]);

  // useEffect(() => {
  //   dispatch(getEmployees());
  //   dispatch(getroles());
  // }, [dispatch]);

  const schema = yup.object().shape({
    staffname: yup.string().required("Staff Name is required"),
    rolename: yup.string().required("User Role is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("staffname", preloadedData.StaffId);
    setValue("rolename", preloadedData.userroles.id);
    setValue(
      "category",
      preloadedData.Category ? preloadedData.Category.id : null
    );
    dispatch(SpecificCategory({ Department: preloadedData.DeptId }));
    // staffnameOnChange(null);//for making asyncselect label with current Username(preloadeddata)
  }, [dispatch, setValue, preloadedData]);

  const {
    field: { value: roleValue, onChange: roleOnChange, ...restRoleField },
  } = useController({ name: "rolename", control });

  const {
    field: { value: catValue, onChange: catOnChange, ...restCatField },
  } = useController({ name: "category", control });

  const {
    field: {
      value: staffValue,
      onChange: staffnameOnChange,
      ...reststaffnameField
    },
  } = useController({ name: "staffname", control });

  const handleDeptChange = async (e) => {
    dispatch(SpecificCategory({ Department: e.value }));
  };

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(
      updateuser({
        toast,
        StaffId: data.staffname,
        role: data.rolename,
        id: preloadedData.id,
        category: data.category
      })
    );
    // staffnameOnChange(null);
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
                  placeholder="Enter Username..."
                  value={
                    staffValue
                      ? employeeoptions.find((x) => x.value === staffValue)
                      : employeeoptions.find(
                          (x) => x.value === preloadedData.StaffId
                        )
                  }
                  onChange={(option) => {
                    staffnameOnChange(option ? option.value : option);
                  }}
                  {...reststaffnameField}
                />
                <i className="text-danger">{errors.staffname?.message}</i>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Department(Optional)</strong>
              </label>
              <br />
              <div className="col-sm-8">
                <Select
                  options={department}
                  placeholder="Select Department"
                  onChange={handleDeptChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Category(Optional)</strong>
              </label>
              <br />
              {categoryOption && (
                <div className="col-sm-8">
                  <Select
                    options={categoryOption}
                    placeholder="Select Category"
                    value={
                      catValue
                        ? categoryOption.find((x) => x.value === catValue)
                        : preloadedData.Category ? categoryOption.find((x)=>x.value === preloadedData.Category.id) : catValue
                    }
                    onChange={(option) =>
                      catOnChange(option ? option.value : option)
                    }
                    {...restCatField}
                  />
                  <i className="text-danger">{errors.rolename?.message}</i>
                </div>
              )}
            </div>
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Role Name</strong>
              </label>
              <br />
              <div className="col-sm-8">
                <Select
                  options={userOption}
                  placeholder="Select Role"
                  value={
                    roleValue
                      ? userOption.find((x) => x.value === roleValue) //this works once user selects the option or by setValue
                      : userOption.find(
                          (option) =>
                            option.value === preloadedData.userroles.id
                        ) //gives the label and value(object) after it matches the condition
                  }
                  onChange={(option) =>
                    roleOnChange(option ? option.value : option)
                  }
                  {...restRoleField}
                />
                <i className="text-danger">{errors.rolename?.message}</i>
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => handleCloseModal()}>
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

export default UpdateMember;
