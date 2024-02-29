import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CSubheader,
  CBreadcrumbRouter,
} from "@coreui/react";
import { NavLink } from "react-router-dom";

// routes config
import routes from "../routes";
import { set } from "src/store/ApplicationSlice";
import logo from "../assets/images/sanima_bank_logo.jpg";

import { TheHeaderDropdown } from "./index";

const TheHeader = () => {
  const dispatch = useDispatch();
  const { sidebarShow } = useSelector((state) => state.application);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch(set({ sidebarShow: val }));
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch(set({ sidebarShow: val }));
  };

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        {/* <CIcon name="logo" height="48" alt="Logo"/> */}
        {/* <img src={logo} name="logo" height="45" alt="Logo"/> */}
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto"></CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdown />
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <NavLink to="/addticket">
          <button className="btn btn-primary mt-2">Create Ticket</button>
        </NavLink>
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
