import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
// import AsyncSelect from "react-select/async";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { addusers, getroles } from "src/store/UserSlice";
import { toast } from "react-toastify";
import Select from "react-select";
// import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { SpecificCategory } from "src/store/CategorySlice";
import * as yup from "yup";

const AddMember = ({ showModal, handleCloseModal }) => {
  const dispatch = useDispatch();
  const { employeeoptions, roles } = useSelector((state) => ({
    ...state.user,
    ...state.accesscontrol,
  }));
  const { category } = useSelector((state) => state.category);
  const { department } = useSelector((state) => state.ticket);
  const [userOption, setUserOption] = useState([]);
  const [member, setMember] = useState(null);
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

  const schema = yup.object().shape({
    staffname: yup.string().required("Staff Name is required"),
    rolename: yup.string().required("User Role is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
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
    field: { value: roleValue, onChange: roleOnChange, ...restRoleField },
  } = useController({ name: "rolename", control });

  const {
    field: { value: catValue, onChange: catOnChange, ...restCatField },
  } = useController({ name: "category", control });

  useEffect(() => {
    // simulate async api call with set timeout
    setMember({ staffname: "", rolename: "" });
  }, []);

  // effect runs when user state is updated
  useEffect(() => {
    reset(member); // reset form with category data
  }, [member]);

  const handleDeptChange = async (e) => {
    dispatch(SpecificCategory({ Department: e.value }));
  };

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(addusers({ toast, role: data.rolename, StaffId: data.staffname,category: data.category }));
    reset();
    // roleOnChange(null);
    // staffnameOnChange(null);
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
              <i>Add User Member</i>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Staff Name *</strong>
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
              <div className="col-sm-8">
                <Select
                  options={categoryOption}
                  placeholder="Select Category"
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
                <i className="text-danger">{errors.rolename?.message}</i>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Role Name *</strong>
              </label>
              <br />
              <div className="col-sm-8">
                <Select
                  options={userOption}
                  placeholder="Select Role"
                  value={
                    roleValue
                      ? userOption.find((x) => x.value === roleValue)
                      : roleValue
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
            <CButton color="secondary" onClick={handleCloseModal}>
              Close
            </CButton>
            <CButton color="primary" className="float-right" type="submit">
              Assign User
            </CButton>
          </CModalFooter>
        </CModal>
      </form>
    </div>
  );
};

export default AddMember;
