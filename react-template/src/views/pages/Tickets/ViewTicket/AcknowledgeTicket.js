import React,{useEffect} from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { getEmployees } from "src/store/AccessSlice";
import { acknowledgeticketuser } from "src/store/ViewTicketSlice";

const AcknowledgeTicket = ({ showModal, handleCloseModal, id }) => {
  const dispatch = useDispatch();
  const { employeeoptions } = useSelector((state) => state.accesscontrol);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  const schema = yup.object().shape({
    acknowledgeuser: yup.string().required("User is required"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data) => {
    // console.log(data);
    dispatch(
      acknowledgeticketuser({
        id,
        acknowledgeuser: data.acknowledgeuser,
        toast,
        message: "Ticket sent for acknowledgement",
      })
    );
    handleCloseModal();
  };

  const {
    field: {
      value: acknowledgeuser,
      onChange: acknowledgeuserOnChange,
      ...restAuserField
    },
  } = useController({ name: "acknowledgeuser", control });

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
              <i>Acknowledge User</i>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="form-group row">
              <label htmlFor="exampleInputEmail1" className="col-sm-4">
                <strong>Username</strong>
              </label>
              <br />
              <div className="col-sm-8">
                <Select
                  cacheOptions
                  defaultOptions
                  options={employeeoptions}
                  placeholder="Enter Username..."
                  value={
                    acknowledgeuser
                      ? employeeoptions.find((x) => x.value === acknowledgeuser)
                      : acknowledgeuser
                  }
                  onChange={(option) =>
                    acknowledgeuserOnChange(option ? option.label : option)
                  }
                  {...restAuserField}
                />
                <i className="text-danger">{errors.acknowledgeuser?.message}</i>
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseModal}>
              Close
            </CButton>
            <CButton color="primary" className="float-right" type="submit">
              Acknowledge User
            </CButton>
          </CModalFooter>
        </CModal>
      </form>
    </div>
  );
};

export default AcknowledgeTicket;
