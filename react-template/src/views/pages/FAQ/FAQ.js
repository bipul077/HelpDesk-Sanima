import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { getfaq,clearFaqError } from "src/store/FaqSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { toast } from "react-toastify";
import { sanitize } from "isomorphic-dompurify";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const FAQ = () => {
  const dispatch = useDispatch();
  const { faq, faqloading, faqerror, faqpage } = useSelector(
    (state) => state.faq
  );
  const [SearchData, setSearchData] = useState();

  useEffect(() => {
    dispatch(getfaq({ currentPage: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if(faqerror){
      toast.error(faqerror);
      dispatch(clearFaqError());
    }
  }, [faqerror,dispatch]);

  if (faqloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  const schema = yup.object().shape({
    search: yup.string().required().trim(),
  });

  const handlePageChange = async (data) => {
    let currentPage = data.selected + 1;
    if (SearchData) {
      dispatch(
        getfaq({ currentPage, search: SearchData ? SearchData.search : "" })
      );
    }
    else{
      dispatch(getfaq({ currentPage }));
    }
  };

  const submitForm = (data) => {
    setSearchData({ ...data });
    dispatch(
      getfaq({
        search: data.search,
      })
    );
  };

  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

  return (
    <div>
      <div className="card">
        <div className="card-header d-flex">
          <strong>Frequently Asked Question</strong>
          <form
            className="form-inline ml-auto"
            onSubmit={handleSubmit(submitForm)}
          >
            <input
              className="form-control"
              type="search"
              placeholder="Search FAQ"
              {...register("search")}
            />
            <button className="btn btn-success" type="submit">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </form>
        </div>
        <div className="card-body">
          <Tabs>
            <TabList>
              <Tab>FAQ</Tab>
            </TabList>
            <TabPanel>
              {faq.map((all, index) => (
                <React.Fragment key={index}>
                  <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index + 1}`}
                          aria-expanded="true"
                          aria-controls={`collapse${index + 1}`}
                        >
                          <li>{all.Question}</li>
                        </button>
                      </h2>
                      <div
                        id={`collapse${index + 1}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: sanitize(all.Answer),
                            }}
                            style={{
                              maxWidth: "1000px",
                              maxHeight: "500px",
                              overflow: "auto",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </TabPanel>
          </Tabs>
        </div>
        <div className="card-footer">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={faqpage}
            marginPagesDisplayed={2} //number of page to be displayed at the end(before next)
            pageRangeDisplayed={2} //number of pages showing after clicking break item
            onPageChange={handlePageChange}
            containerClassName={"pagination justify-content-center"} //bootstrap class
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
