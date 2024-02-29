import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";
// import {isAllowedToDepartment, isAllowedToBranch} from '../services/RoutingMiddleware';

// routes config
import routes from "../routes";
import { IsLoggedIn } from "../helpers/IsLoggedIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SanimaLoader from "../helpers/SanimaLoader";
// import { Provider } from "react-redux";
// import store from "src/store/store";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

let bool;
const middlewareChecker = (authorized) => {
  // const path = props.path;
  if (authorized === undefined) {
    return true;
  } else if (authorized !== undefined) {
    const authorizedArray = authorized;

    authorizedArray.forEach((data) => {
      if (data === true) bool = true;
      else bool = false;
    });

    return bool;
  } else {
    return false;
  }
};

const TheContent = () => {
  return (
        <main className="c-main">
          <CContainer fluid>
            <Suspense fallback={loading}>
              <Switch>
                {IsLoggedIn() ? (
                  routes.map((route, idx) => {
                    return (
                      route.component && (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={(props) =>
                            middlewareChecker(route.authorized) ? (
                              <CFade>
                                <route.component {...props} />
                              </CFade>
                            ) : (
                              <Redirect to="/not-authorized" />
                            )
                          }
                        />
                      )
                    );
                  })
                ) : (
                  <Redirect to="/" />
                )}
                <Redirect from="/" to="/page-not-found" />
              </Switch>
            </Suspense>
          </CContainer>
          <ToastContainer />
          <SanimaLoader />
        </main>
  );
};

export default React.memo(TheContent);
