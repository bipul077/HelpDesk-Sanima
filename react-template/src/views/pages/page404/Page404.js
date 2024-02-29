import React from 'react'
import logo from '../../../assets/images/sanima-logo.svg'

const Page404 = () => {

  const goBack = () => {
    window.history.back();
  }

  return (
    <div className="container-fluid" style={{ marginTop: "8%" }}>
      <div className="row justify-content-center">
        <div className="col-sm-12 text-center">
          <img src={logo} className="logo-404" alt="Sanima-Bank-Logo"/>
        </div>
        <div className="col-sm-6">
          <div className="text-center">
            <h1 className="mt-4">404</h1>
            <h4 className="p-1">Oops! You{'\''}re lost.</h4>
            <p className="text-muted">The page you are looking for was not found.</p>
          </div>
          <div className="col-sm-12 text-center">
            <button className="btn btn-primary" onClick={() => goBack()}>
              <i className="fa fa-arrow-left mr-2"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page404
