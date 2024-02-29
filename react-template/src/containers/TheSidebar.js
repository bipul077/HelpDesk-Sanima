import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import { decodeToken } from "react-jwt";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarMinimizer,
} from "@coreui/react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/sanima-logo-monochrome.svg";
import { getspecificmember } from "src/store/UserSlice";

// import { isAllowedToDepartment } from "../services/RoutingMiddleware";

const TheSidebar = () => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const dispatch = useDispatch();
  const { sidebarShow: show, myuser } = useSelector((state) => ({
    ...state.user,
    ...state.application,
  }));

  useEffect(() => {
    dispatch(
      getspecificmember({
        StaffId: decodedToken && decodedToken.data.recordset[0].StaffId,
      })
    );
  }, [dispatch]);

  return (
    <CSidebar
      show={show}
      className="c-sidebar-sanima"
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <img
          src={logo}
          alt="Sanima-Bank"
          className="c-sidebar-brand-full"
          name="logo-negative"
          width={200}
        />
        <img
          src={logo}
          alt="Sanima-Bank"
          className="c-sidebar-brand-minimized"
          name="sygnet"
          width={45}
        />
      </CSidebarBrand>
      <CSidebarNav>
        {/* {allusers.map((data, index) => ( */}
        {/* <React.Fragment key={index}> */}
        {/* {data.StaffId === decodedToken.data.recordset[0].StaffId &&
              data.role_id === 1 && ( */}
        {myuser && myuser.role_id === 1 && (
          <div
            onClick={(event) => sideBarToggle(event)}
            className="c-sidebar-nav-dropdown"
          >
            <p
              className="c-sidebar-nav-dropdown-toggle"
              aria-label="menu dropdown"
            >
              <CIcon
                content={freeSet.cilUser}
                customClasses="c-sidebar-nav-icon"
              />
              Admin
            </p>
            <ul className="c-sidebar-nav-dropdown-items">
              <li className="c-sidebar-nav-item">
                <NavLink className="c-sidebar-nav-link" to="/branches">
                  All Branches
                </NavLink>
              </li>
              <li className="c-sidebar-nav-item">
                <NavLink className="c-sidebar-nav-link" to="/members">
                  Manage Members
                </NavLink>
              </li>
              <li className="c-sidebar-nav-item">
                <NavLink className="c-sidebar-nav-link" to="/userroles">
                  User Roles
                </NavLink>
              </li>
              <li className="c-sidebar-nav-item">
                <NavLink className="c-sidebar-nav-link" to="/accesscontrol">
                  Access Control
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        {myuser && myuser.role_id === 2 && (
          <>
            <div
              onClick={(event) => sideBarToggle(event)}
              className="c-sidebar-nav-dropdown"
            >
              <p
                className="c-sidebar-nav-dropdown-toggle"
                aria-label="menu dropdown"
              >
                <CIcon
                  content={freeSet.cilUser}
                  customClasses="c-sidebar-nav-icon"
                />
                Ticket Manager
              </p>
              <ul className="c-sidebar-nav-dropdown-items">
                <li className="c-sidebar-nav-item">
                  <NavLink className="c-sidebar-nav-link" to="/severity">
                    Severity
                  </NavLink>
                </li>

                <li className="c-sidebar-nav-item">
                  <NavLink className="c-sidebar-nav-link" to="/category">
                    Main Category
                  </NavLink>
                </li>
                <li className="c-sidebar-nav-item">
                  <NavLink className="c-sidebar-nav-link" to="/subcategory">
                    Sub Category
                  </NavLink>
                </li>
                <li className="c-sidebar-nav-item">
                  <NavLink className="c-sidebar-nav-link" to="/faqadmin">
                    FAQ
                  </NavLink>
                </li>
                <li className="c-sidebar-nav-item">
                  <NavLink className="c-sidebar-nav-link" to="/manualadmin">
                    Manuals / Forms
                  </NavLink>
                </li>
                <li className="c-sidebar-nav-item">
                  <NavLink className="c-sidebar-nav-link" to="/linkadmin">
                    Links
                  </NavLink>
                </li>
                <li className="c-sidebar-nav-item">
                  <NavLink className="c-sidebar-nav-link" to="/eodnotice">
                    EOD Notice
                  </NavLink>
                </li>
                <li className="c-sidebar-nav-item">
                  <NavLink
                    className="c-sidebar-nav-link"
                    to="/predefinedresponse"
                  >
                    Pre-defined Response
                  </NavLink>
                </li>
              </ul>
            </div>
          </>
        )}

        <li className="c-sidebar-nav-item">
          <NavLink className="c-sidebar-nav-link" to="/dashboard">
            <CIcon
              content={freeSet.cilSpeedometer}
              customClasses="c-sidebar-nav-icon"
            />
            Dashboard
          </NavLink>
        </li>
        <div
          onClick={(event) => sideBarToggle(event)}
          className="c-sidebar-nav-dropdown"
        >
          <p
            className="c-sidebar-nav-dropdown-toggle"
            aria-label="menu dropdown"
          >
            <CIcon
              content={freeSet.cilCursor}
              customClasses="c-sidebar-nav-icon"
            />
            Tickets
          </p>
          <ul className="c-sidebar-nav-dropdown-items">
            <li className="c-sidebar-nav-item">
              <NavLink className="c-sidebar-nav-link" to="/tickets">
                All Tickets
              </NavLink>
            </li>

            <li className="c-sidebar-nav-item">
              <NavLink className="c-sidebar-nav-link" to="/userticket">
                Tickets Created By You
              </NavLink>
            </li>

            <li className="c-sidebar-nav-item">
              <NavLink className="c-sidebar-nav-link" to="/assignticket">
                Tickets Assigned To You
              </NavLink>
            </li>

            <li className="c-sidebar-nav-item">
              <NavLink className="c-sidebar-nav-link" to="/acknowledgeticket">
                Acknowledge Ticket
              </NavLink>
            </li>
          </ul>
        </div>
        <li className="c-sidebar-nav-item">
          <NavLink className="c-sidebar-nav-link" to="/faq">
            <CIcon
              content={freeSet.cilCommentBubble}
              customClasses="c-sidebar-nav-icon"
            />
            FAQs
          </NavLink>
        </li>
        <li className="c-sidebar-nav-item">
          <NavLink className="c-sidebar-nav-link" to="/manuals">
            <CIcon
              content={freeSet.cilAddressBook}
              customClasses="c-sidebar-nav-icon"
            />
            Manuals / Forms
          </NavLink>
        </li>
        <li className="c-sidebar-nav-item">
          <NavLink className="c-sidebar-nav-link" to="/importantlink">
            <CIcon
              content={freeSet.cilLink}
              customClasses="c-sidebar-nav-icon"
            />
            Important Links
          </NavLink>
        </li>
        {myuser && myuser.role_id === 2 && (
          <div
            onClick={(event) => sideBarToggle(event)}
            className="c-sidebar-nav-dropdown"
          >
            <p
              className="c-sidebar-nav-dropdown-toggle"
              aria-label="menu dropdown"
            >
              <CIcon
                content={freeSet.cilListRich}
                customClasses="c-sidebar-nav-icon"
              />
              Reports
            </p>
            <ul className="c-sidebar-nav-dropdown-items">
              <li className="c-sidebar-nav-item">
                <NavLink
                  className="c-sidebar-nav-link"
                  to="/ticketsolvebystaff"
                >
                  Tickets Solved By Staff
                </NavLink>
              </li>
              <li className="c-sidebar-nav-item">
                <NavLink
                  className="c-sidebar-nav-link"
                  to="/ticketcategorysolve"
                >
                  Tickets Category Solved
                </NavLink>
              </li>
              <li className="c-sidebar-nav-item">
                <NavLink className="c-sidebar-nav-link" to="/reporthr">
                  Report
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

const sideBarToggle = (event) => {
  var parentElement = event.target.parentNode;
  var nameOfClass = event.target.parentNode.className;
  // console.log(nameOfClass)
  if (nameOfClass.split(" ").includes("c-show")) {
    parentElement.classList.remove("c-show");
  } else {
    parentElement.classList.add("c-show");
  }
};

export default React.memo(TheSidebar);
