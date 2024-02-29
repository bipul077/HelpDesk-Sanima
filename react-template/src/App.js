import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import alertify from 'alertifyjs';

//override defaults of alertifyjs
alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn btn-sm btn-primary";
alertify.defaults.theme.cancel = "btn btn-sm btn-danger";
alertify.defaults.theme.input = "form-control";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const CentralLogin = React.lazy(() => import('./services/CentralLogin'));

class App extends Component {
  // componentDidMount() {
  //   window.process = {
  //     ...window.process,
  //   };
  // }
  render() {
    return (
      // <Provider store={store}>
      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/check_and_set_central_token" name="Central Login" render={props => <CentralLogin {...props}/>}/> 
              <Route path="*" name="Home" render={props => <TheLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </HashRouter>
      // </Provider>
    );
  }
}

export default App;
