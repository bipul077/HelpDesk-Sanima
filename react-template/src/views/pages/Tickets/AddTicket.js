import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { SpecificCategory, SubCategory,clearCatError } from "src/store/CategorySlice";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";
import {useHistory} from 'react-router-dom';
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addTicket,getDepartment,getsubCatSeverity,getSeverity,clearspecificsevError } from "src/store/TicketSlice";
import { clearticketError } from "src/store/TicketSlice";
import FileInput from "./ViewTicket/Fileinput";
const Editor = React.lazy(() => import("../editor/Editor"));

const AddTicket = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const { category,subcategory, loading, error } = useSelector((state) => ({
  //   ...state.category,...state.ticket
  // }));
  const { category,subcategory, catloading, caterror } = useSelector((state) => (state.category));
  const {department,ticketloading,ticketerror,specificseverity,severity} = useSelector((state)=>(state.ticket));

  const [resTicket, setResTicket] = useState(null);
  const [categoryOption, setCategoryOption] = useState([]);
  const [defaultSeverity,setDefaultSeverity] = useState([]);
  const [subcategoryOption, setSubCategoryOption] = useState([]);
  const [key, setKey] = useState(0);
  const [fileInputs, setFileInputs] = useState([1]);
  const TP = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Urgent", label: "Urgent" },
  ];

  useEffect(()=>{
    dispatch(getDepartment());
    dispatch(getSeverity());
  },[dispatch])

  useEffect(() => {
    if (category && category.length > 0) {
      const catOptions = category.map((option) => ({
        label: option.Name,
        value: option.id,
      }));
      setCategoryOption(catOptions);
    }
    if (subcategory && subcategory.length > 0) { 
      const subOptions = subcategory.map((option) => ({
        label: option.Name,
        value: option.id,
      }));
      setSubCategoryOption(subOptions);
    }
    if(severity && severity.length > 0){
      if(deptValue === 66){
        const defsevoptions = severity.find((x)=>(
          x.label.includes('Important')
        ));
        setDefaultSeverity([defsevoptions]);
      }
      else if(deptValue===67){
        const defsevoptions = severity.find((x)=>(
          x.label.includes('Low')
        ));
        setDefaultSeverity([defsevoptions]);
      }
    }
  }, [category,subcategory,severity]);

  useEffect(() => {
    if(caterror){
      toast.error(caterror);
      dispatch(clearCatError());
    }
  }, [caterror,dispatch]);
  
  useEffect(() => {
    if(ticketerror){
      toast.error(ticketerror);
      dispatch(clearticketError());
    }
  }, [ticketerror,dispatch]);
  
  if (ticketloading === true || catloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  useEffect(() => {
    // simulate async api call with set timeout
    setResTicket({ tp: "",department:"", category: "", subcategory: "", severity:"" })
  }, []);

  // effect runs when user state is updated
  useEffect(() => {
    reset(resTicket); // reset form with category data
  }, [resTicket]);

  const schema = yup.object().shape({
    ticket_subject: yup.string().required("Ticket Subject is required"),
    department: yup.string().required("Department is required"),
    tp: yup.string().required("Ticket Priority is required"),
    // ts: yup.string().required("Ticket Status is required"),
    category: yup.string().required("Category is required"),
    severity: yup.string().when("department", {
      is: (department)=>["66","67"].includes(department),
      then:()=> yup.string().required("Severity is required"),
    }),
    // assignuser: yup.string().required("Assign User is required"),
    TicketBody: yup.string().required("Ticket Body is required")
    // picture: yup.mixed().test("fileRequired", "File is required", (value) => {
    //   //fileRequired is must for showing message "File is required"
    //   return value && value[0];
    // }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    field: { value: deptValue, onChange: deptOnChange, ...restDeptField },
  } = useController({ name: "department", control });

  const {
    field: { value: tpValue, onChange: tpOnChange, ...restTpField },
  } = useController({ name: "tp", control });

  const {
    field: { value: catValue, onChange: catOnChange, ...restCatField },
  } = useController({ name: "category", control });

  const {
    field: { value: subcatValue, onChange: subcatOnChange, ...restsubCatField },
  } = useController({ name: "subcategory", control });


  const {
    field: {
      value: sevValue,
      onChange: severityOnChange,
      ...restSeverityField
    },
  } = useController({ name: "severity", control });

  const { field } = useController({
    name: "TicketBody",
    control,
    defaultValue: "", // Initial value for the CKEditor content
  });

  const submitForm = async (data) => {
    // console.log(data);
    const formData = new FormData();
    // console.log(data);
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] instanceof FileList) {
        // If the property is a FileList (representing a file input)
        const fileList = data[key];
        // Iterate through the files in the FileList
        for (let i in fileList) {
          const file = fileList[i];
          // Append each file to formData 
          formData.append('Image', file);
        }
      }
    }
    formData.append('Ticket_Subject', data.ticket_subject);
    // formData.append('User', data.User);
    formData.append('Assign_User',data.assignuser || "");
    formData.append('Ticket_Priority',data.tp);
    // formData.append('Ticket_Status',data.ts);
    formData.append('Department_id',data.department);
    formData.append('Ticket_Body',data.TicketBody);
    formData.append('Severity_id',data.severity);
    formData.append('Category_id',data.category);
    formData.append('SubCategory_id',data.subcategory);

    dispatch(
      addTicket({
        formData,
        toast,
        history
      })
    );
    reset();
    // deptOnChange(null);
    // tpOnChange(null);
    // // tsOnChange(null);
    // catOnChange(null);
    // severityOnChange(null);
    setKey((prevKey) => prevKey + 1);
  };

  const handleDeptChange = async (e) => {
    dispatch(clearspecificsevError());
    setCategoryOption([]);
    catOnChange(null);
    subcatOnChange(null);
    severityOnChange(null);
    dispatch(SpecificCategory({ Department: e.value }));
    deptOnChange(e ? e.value : e);
  };

  const handleCatChange = async (e) => {
    dispatch(clearspecificsevError());
    setSubCategoryOption([]);
    subcatOnChange(null);
    severityOnChange('');
    dispatch(SubCategory({ Category: e.value }));
    catOnChange(e ? e.value : e);
  };

  const handleSubCatChange = async (e) => {
    // setSubCategoryOption([]);
    severityOnChange('');
    dispatch(getsubCatSeverity({ id: e.value }));
    subcatOnChange(e ? e.value : e)
  };

  const fileclick=(e)=>{
    e.preventDefault()
    setFileInputs((prevInputs) => [...prevInputs, 1]);//pushes 1 to the existing array
  }

  return (
    <div>
      <div className="container-fluid min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              {/* <Editor /> */}
              <div className="card p-3 mb-5">
                <div className="card-header">
                  <h3 className="font-italic">Create Ticket</h3>
                </div>
                <div className="card-body border rounded mt-2">
                  <form onSubmit={handleSubmit(submitForm)}>
                    <div className="form-group d-flex">
                      <label htmlFor="inputField" className="col-sm-3">
                        <strong>Ticket Subject *</strong>
                      </label>
                      <div className="col-sm-9">
                        <input
                          className="form-control"
                          type="text"
                          {...register("ticket_subject")}
                          placeholder="Enter Ticket Subject"
                        />
                        <i className="text-danger">
                          {errors.ticket_subject?.message}
                        </i>
                      </div>
                    </div>
                    <div className="form-group d-flex">
                      <label htmlFor="inputField" className="col-sm-3">
                        <strong>Ticket Priority *</strong>
                      </label>
                      <div className="col-sm-3">
                        <Select
                          name="priority"
                          options={TP}
                          placeholder="Select Ticket Priority"
                          value={
                            tpValue
                              ? TP.find((x) => x.value === tpValue) //find() returns the value of the first element in an array that passes a test
                              : tpValue
                          }
                          onChange={(option) =>
                            tpOnChange(option ? option.value : option)
                          }
                          {...restTpField}
                        />
                        <i className="text-danger">{errors.tp?.message}</i>
                      </div>
                    </div>
                    <div className="form-group d-flex">
                      <label htmlFor="inputField" className="col-sm-3">
                        <strong>Ticket Status</strong>
                      </label>
                      <div className="col-sm-3">
                        <input className="form-control" readOnly value="New"/>
                        <i className="text-danger">{errors.ts?.message}</i>
                      </div>
                    </div>
                    <div className="form-group d-flex">
                      <label htmlFor="inputField" className="col-sm-3">
                        <strong>Select Department *</strong>
                      </label>
                      <div className="col-sm-3">
                        <Select
                          options={department}
                          placeholder="Select Department"
                          onChange={handleDeptChange}
                          value={
                            deptValue
                              ? department.find((x) => x.value === deptValue)
                              : deptValue
                          }
                          {...restDeptField}
                        />
                        <i className="text-danger">
                          {errors.department?.message}
                        </i>
                      </div>
                    </div>
                    <div className="form-group d-flex">
                      <label htmlFor="inputField" className="col-sm-3">
                        <strong>Ticket Category *</strong>
                      </label>
                      <div className="col-sm-3">
                        <Select
                          options={categoryOption}
                          placeholder="Select Category"
                          value={
                            catValue
                              ? categoryOption.find((x) => x.value === catValue)
                              : catValue
                          }
                          onChange={handleCatChange}
                          {...restCatField}
                        />
                        <i className="text-danger">
                          {errors.category?.message}
                        </i>
                      </div>
                    </div>
                    {catValue && 
                    <div className="form-group d-flex">
                    <label htmlFor="inputField" className="col-sm-3">
                      <strong>Ticket SubCategory</strong>
                    </label>
                    <div className="col-sm-3">
                      <Select
                        options={subcategoryOption}
                        placeholder="Select Sub Category"
                        value={//value is must for setting the value to null after handlechange
                          subcatValue
                            ? subcategoryOption.find((x) => x.value === subcatValue)
                            : subcatValue
                        }
                        onChange={handleSubCatChange}
                        {...restsubCatField}
                      />
                    </div>
                  </div>
                    }
                    {[66,67].includes(deptValue) && (
                     <div className="form-group d-flex">
                      <label htmlFor="inputField" className="col-sm-3">
                        <strong>Severity *</strong>
                      </label>
                      <div className="col-sm-3">
                        <Select
                          options={specificseverity.length > 0 ? specificseverity : defaultSeverity}
                          placeholder="Select Severity"
                          value={
                            sevValue
                            ? specificseverity.find((x) => x.value === sevValue)
                            : sevValue
                          }
                          onChange={(option) =>
                            severityOnChange(option ? option.value : option)
                          }
                          {...restSeverityField}
                        />
                        <i className="text-danger">
                          {errors.severity?.message}
                        </i>
                      </div>
                    </div>)}

                    <div className="form-group d-flex">
                      <label htmlFor="inputField" className="col-sm-3">
                        <strong>Ticket Body *</strong>
                      </label>
                      <div className="col-sm">
                        <Editor
                          content={"Please attach the image here"}
                          onChange={field.onChange}
                          key={key}
                        />
                        <i className="text-danger">
                          {errors.TicketBody?.message}
                        </i>
                      </div>
                    </div>
                    {fileInputs.map((x,index)=>(
                       <FileInput
                       key={index}
                       register={register}
                       name={`picture${index + 1}`}
                     />
                    ))}
                    <div className="form-group d-flex">
                      <div className="col-sm-3">
                        <button className="btn btn-sm btn-info" onClick={(e)=>fileclick(e)}>
                          Add another file
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success float-right">
                      Create Ticket
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;
