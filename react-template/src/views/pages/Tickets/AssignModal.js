import React from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addassignuser } from "src/store/ViewTicketSlice";
import * as yup from "yup";
import { getStaff } from "src/store/CategorySlice";
import { toast } from "react-toastify";

const AssignModal = ({ showModal, handleCloseModal, id }) => {
  const dispatch = useDispatch();
  const { staff } = useSelector((state) => state.category);

  const schema = yup.object().shape({
    assignuser: yup.string().required("User is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data) => {
    dispatch(
      addassignuser({
        id,
        assignuserid: data.assignuser,
        toast,
        message: "User Assign Successfully",
      })
    );
    handleCloseModal();
  };

  const loadOptions = async (inputValue, callback) => {
    try {
      if (inputValue) {
        dispatch(getStaff({ inputValue }));
      }

      const formattedOptions = staff.map((option) => ({
        value: option.StaffId,
        label: option.Username,
      }));
      // console.log(formattedOptions);
      callback(formattedOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    field: {
      value: assignuser,
      onChange: assignuserOnChange,
      ...restAuserField
    },
  } = useController({ name: "assignuser", control });

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
              <i>Assign User</i>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Username</strong>
              </label>
              <br />
              <div className="col-sm-8">
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptions}
                  placeholder="Enter Username..."
                  // value={
                  //   assignuser
                  //     ? { value: assignuser, label: assignuser }
                  //     : assignuser
                  // }
                  onChange={(option) =>
                    assignuserOnChange(option ? option.value : option)
                  }
                  {...restAuserField}
                />
                <i className="text-danger">{errors.assignuser?.message}</i>
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

export default AssignModal;
