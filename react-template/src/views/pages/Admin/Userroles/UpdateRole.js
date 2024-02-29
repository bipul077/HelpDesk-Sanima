import React,{useEffect} from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateroles } from "src/store/UserSlice";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import {toast} from "react-toastify";

const UpdateRole = ({showModal,handleCloseModal,preloadedData}) => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    rolename: yup.string().required("User Role is required").min(2),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("rolename", preloadedData.RoleName); 
  }, [setValue,preloadedData]);

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(updateroles({ toast, rolename: data.rolename,id:preloadedData.id }));
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
                <strong>Role Name</strong>
              </label>
              <br />
              <div className="col-sm-8">
                <input
                  className="form-control"
                  placeholder="Enter role"
                  type="text"
                  {...register("rolename")}
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
                Update Role
            </CButton>
          </CModalFooter>
        </CModal>
      </form>
    </div>
  );
};

export default UpdateRole;
