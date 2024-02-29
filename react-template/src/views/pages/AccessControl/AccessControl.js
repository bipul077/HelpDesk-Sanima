import React, { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Staff from "./Staff";
import GetAccessControl from "./GetAccessControl";
import Job from "./Job";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "src/store/ApplicationSlice";
import { getDepartment } from "src/store/AccessSlice";
import { getEmployees, getaccesscontrols,clearAccessError } from "src/store/AccessSlice";

const AccessControl = () => {
  const dispatch = useDispatch();
  const {
    accesscontrols,
    employeeoptions,
    acdepartment,
    accessloading,
    accesserror,
    acpage,
  } = useSelector((state) => state.accesscontrol);
  
  useEffect(() => {
    dispatch(getaccesscontrols());
    dispatch(getDepartment());
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    if(accesserror){
      toast.error(accesserror);
      dispatch(clearAccessError());
    }
  }, [accesserror,dispatch]);

  if (accessloading === true) {
    dispatch(showLoader());
  } else {
    dispatch(hideLoader());
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <strong>Roles</strong>
        </div>
        <div className="card-body">
          <Tabs>
            <TabList>
              <Tab>By Staff</Tab>
              <Tab>By Job</Tab>
            </TabList>
            <TabPanel>
              <Staff
                employeeoptions={employeeoptions}
                department={acdepartment}
              />
            </TabPanel>

            <TabPanel>
              <Job department={acdepartment} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
      <GetAccessControl
        accesscontrols={accesscontrols}
        employees={employeeoptions}
        department={acdepartment}
      />
    </div>
  );
};

export default AccessControl;
