import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { IsLoggedIn }from '../../../helpers/IsLoggedIn';
import { login } from '../../../services/Services';

// For Toastr
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {useHistory} from 'react-router-dom';

// For Loading Loader
import { showLoader, hideLoader } from "../../../actions/Actions"
import SanimaLoader from "../../../helpers/SanimaLoader";

// Validator Packages
import SimpleReactValidator from 'simple-react-validator';

import logo from '../../../assets/images/sanima_bank_logo.jpg'

const Login = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  
  // Validator Imports
  const validator = useRef(new SimpleReactValidator()).current;
  const [, forceUpdate] = useState();

  const [state, setState] = useState({
    username:'',
    password:'',
  })

  const handleChange = e => {
    setState(prevState => ({
      ...prevState, [e.target.name]: e.target.value
    }))
  } 

  useEffect(() => { 
    if (IsLoggedIn()) {
      history.push('/dashboard');
    }
  }, );

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch( showLoader() )

    if (validator.allValid()) {
      const username = state.username;
      const password = state.password;

      login(username, password).then((res) => {
        const response = res.data;
      
        if(response.success === true){
          const token = response.token;
          localStorage.setItem('token', token);
          props.history.push("/dashboard");
        } else{
          toast.error('Invalid Username or Password');
        }

        dispatch( hideLoader() );
      }).catch(error => {
          toast.error("Failed to communicate with API. Please try again later!");
          dispatch(hideLoader());
      });
    } else {
      validator.showMessages();
      forceUpdate(1);
      dispatch( hideLoader() );
    }
  }
  
  const backgroundImageStyle = {
    backgroundImage: 'url("./static/images/helpdeskbg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="app-body">
      <div className="c-app c-default-layout flex-row align-items-center" style={backgroundImageStyle}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mx-auto">
            {/* <h1 className="text-center"><span className="text-success">Sanima </span><span className="text-info">HelpDesk</span></h1> */}
              <div className="card-group">
                <div className="card p-4">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <img src={logo} className="logo-login" alt="Sanima-Bank"/>
                      <p className="text-muted text-center">Sign in to your account using domain credentials</p>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text"><i className="fa fa-user"></i></span>
                        </div>
                        <input type="text" value={state.username} className={`form-control`} placeholder="Username" autoComplete="off" name="username" onChange={handleChange}/>
                        {validator.message('username', state.username, 'required')}
                      </div>
                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text"><i className="fa fa-lock"></i></span>
                        </div>
                        <input type="password" value={state.password} className={`form-control`} placeholder="Password" autoComplete="off" name="password" onChange={handleChange}/>
                        {validator.message('password', state.password, 'required')}
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <button type="submit" className="btn btn-sanima px-4 btn-block">Login</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <SanimaLoader/>
    </div>
  )
} 

export default Login