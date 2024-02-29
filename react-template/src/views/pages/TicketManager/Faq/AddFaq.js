import React,{useState} from "react";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import { useForm, useController } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { addfaq } from "src/store/FaqSlice";
import {toast} from 'react-toastify';
const Editor = React.lazy(() => import("../../editor/Editor"));


const AddFaq = ({ showModal, handleCloseModal }) => {
  const dispatch = useDispatch();
  const [key, setKey] = useState(0);
  const schema = yup.object().shape({
    question: yup.string().required("Question is required").trim(),
    answer: yup.string().required("Answer is required").trim()
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

  const { field } = useController({
    name: "answer",
    control,
    defaultValue: "", // Initial value for the CKEditor content
  });

  const submitForm = async (data) => {
    dispatch(
        addfaq({
        question: data.question,
        answer: data.answer,
        toast
      })
    );
    setKey((prevKey) => prevKey + 1);
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
            <i>Add FAQ</i>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="form-group d-flex">
              <label htmlFor="exampleInputEmail1" className="col-md-4">
                <strong>Question *</strong>
              </label>
              <br />
              <div className="col-md-8">
                <input className="form-control" {...register("question")} />
                <i className="text-danger">{errors.question?.message}</i>
              </div>
            </div>
            <div className="form-group d-flex">
              <label className="col-md-4">
                <strong>Answer *</strong>
              </label>
              <div className="col-md-8">
                <Editor
                  content={"Write the FAQ Answer here ..."}
                  onChange={field.onChange}
                  key={key}
                />
                <i className="text-danger">{errors.answer?.message}</i>
              </div>
            </div>
            <CButton color="primary" className="float-right" type="submit">
              Add
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

export default AddFaq;
