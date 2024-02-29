import React,{useEffect} from 'react';
import {
    CModal,
    CModalTitle,
    CButton,
    CModalHeader,
    CModalFooter,
    CModalBody,
  } from "@coreui/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateLink } from "src/store/LinkSlice";
import { toast } from "react-toastify";

const UpdateLink = ({ showModal, handleCloseModal, preloadedData }) => {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
      } = useForm();

      useEffect(()=>{
        setValue("appname",preloadedData.App_Name);
        setValue("link",preloadedData.Link);
      },[preloadedData])

      const submitForm = async (data) => {
        dispatch(
          updateLink({
            id: preloadedData.id,
            appname: data.appname,
            link: data.link,
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
        size=""
      >
        <CModalHeader onClose={false}>
          <CModalTitle>
            <i>Update Link</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>App Name *</strong>
              </label>
              <br />
              <div className="col-md-8">
                <input
                  className="form-control"
                  {...register("appname", {
                    required: "App name is required",
                    pattern: {
                      value: /\S/, // This regular expression ensures at least one non-whitespace character
                      message: "App name cannot consist of only spaces",
                    },
                  })}
                />
                <i className="text-danger">{errors.appname?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label className="col-md-4">
                <strong>Update Link *</strong>
              </label>
              <div className="col-md-8">
                <input
                  className="form-control"
                  {...register("link", {
                    required: "Link is required",
                    pattern: {
                      value: /\S/, // This regular expression ensures at least one non-whitespace character
                      message: "Link cannot consist of only spaces",
                    },
                  })}
                />
                <i className="text-danger">{errors.link?.message}</i>
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

export default UpdateLink
