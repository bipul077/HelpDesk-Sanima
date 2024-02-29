import React,{useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm,useController } from "react-hook-form";
import {
    CModal,
    CModalTitle,
    CButton,
    CModalHeader,
    CModalFooter,
    CModalBody,
  } from "@coreui/react";
import Select from "react-select";
import { getSeverity } from 'src/store/TicketSlice';
import { editSeverity } from 'src/store/ViewTicketSlice';
import {toast} from 'react-toastify';

const SeverityChange = ({ showModal, handleCloseModal,sevid,ticketId}) => {
    const dispatch = useDispatch();
    const { severity} = useSelector(
        (state) => state.ticket
      );
    useEffect(()=>{
        dispatch(getSeverity());
    },[]);

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
      } = useForm();

      useEffect(() => {
        setValue("severity", sevid);
      }, [setValue]);

    const {
        field: { value: sevValue, onChange: sevOnChange, ...restsevField },
      } = useController({ name: "severity", control });

      const submitForm = async (data) => {
        // console.log(data);
        dispatch(editSeverity({id:ticketId,severity:data.severity,toast}))
        handleCloseModal();
        reset();
      };

  return (
    <div>
       <CModal
        show={showModal}
        onClose={handleCloseModal}
        style={{ zIndex: 10000 }}
        size=""
      >
        <CModalHeader onClose={false}>
          <CModalTitle>
            <i>Change Severity</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form 
         onSubmit={handleSubmit(submitForm)}
          >
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Severity</strong>
              </label>
              <br />
              <div className="col-md-8">
              <Select
                  options={severity}
                  placeholder="Select Severity"
                  value={
                    sevValue
                      ? severity.find((x) => x.value === sevValue)
                      : severity.find((option) => option.value === sevid)
                  }
                  onChange={(option) =>
                    sevOnChange(option ? option.value : option)
                  }
                  {...restsevField}
                />
              </div>
            </div>
            <CButton color="primary" className="float-right" type="submit">
              Update
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
  )
}

export default SeverityChange
