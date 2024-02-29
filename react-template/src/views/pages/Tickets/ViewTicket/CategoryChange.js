import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useController } from "react-hook-form";
import {
  CModal,
  CModalTitle,
  CButton,
  CModalHeader,
  CModalFooter,
  CModalBody,
} from "@coreui/react";
import Select from "react-select";
import { toast } from "react-toastify";
import { SpecificCategory,SubCategory } from "src/store/CategorySlice";
// import { getSeverity } from 'src/store/TicketSlice';
import { editCategory } from 'src/store/ViewTicketSlice';

const CategoryChange = ({ showModal, handleCloseModal, data,ticketId }) => {
  const dispatch = useDispatch();
  const { category,subcategory } = useSelector((state) => state.category);
  const [categoryOption, setCategoryOption] = useState([]);
  const [subcategoryOption, setSubCategoryOption] = useState([]);

  useEffect(() => {
    dispatch(SpecificCategory({ Department: null }));
    if(data.catid !== ''){
        dispatch(SubCategory({ Category: data.catid }));
    }
  }, [dispatch,data]);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("category", data.catid);
    setValue("subcategory",data.subcatid);
  }, [setValue,data]);

  const {
    field: { value: catValue, onChange: catOnChange, ...restcatField },
  } = useController({ name: "category", control });

  const {
    field: { value: subcatValue, onChange: subcatOnChange, ...restsubcatField },
  } = useController({ name: "subcategory", control });

  useEffect(() => {
    if (category && category.length > 0) {
      const transformedOptions = category.map((option) => ({
        label: option.Name,
        value: option.id,
      }));
      setCategoryOption(transformedOptions);
    }
    if (subcategory && subcategory.length > 0) { 
        const subOptions = subcategory.map((option) => ({
          label: option.Name,
          value: option.id,
        }));
        setSubCategoryOption(subOptions);
      }
  }, [category,subcategory]);

  const handleCatChange = async (e) => {
    setSubCategoryOption([]);
    subcatOnChange(null);
    data.subcatid = null;
    dispatch(SubCategory({ Category: e.value }));
    catOnChange(e ? e.value : e);
  };

  const submitForm = async (data) => {
    //console.log(data);
    dispatch(editCategory({id:ticketId,category:data.category,subcategory:data.subcategory,toast}))
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
              <i>Change Category/SubCategory {data.subcatid}</i>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <form onSubmit={handleSubmit(submitForm)}
            >
              <div className="form-group d-flex">
                <label htmlFor="exampleInputEmail1" className="col-md-4">
                  <strong>Category</strong>
                </label>
                <br />
                <div className="col-md-8">         
                  <Select
                    options={categoryOption}
                    placeholder="Select Category"
                    value={
                      catValue
                        ? categoryOption.find((x) => x.value === catValue)
                        : categoryOption.find(
                            (option) => option.value === data.catid
                          )
                    }
                    onChange={handleCatChange}
                    {...restcatField}
                  />
                </div>
              </div>
              <div className="form-group d-flex">
                <label htmlFor="exampleInputEmail1" className="col-md-4">
                  <strong>SubCategory</strong>
                </label>
                <br />
                <div className="col-md-8">         
                  <Select
                    options={subcategoryOption}
                    placeholder="Select SubCategory"
                    value={
                      subcatValue
                        ? subcategoryOption.find((x) => x.value === subcatValue)
                        : data.subcatid ? subcategoryOption.find(
                            (option) => option.value === data.subcatid 
                          ) : subcatValue
                    }
                    onChange={(option) =>
                      subcatOnChange(option ? option.value : option)
                    }
                    {...restsubcatField}
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
  );
};

export default CategoryChange;
