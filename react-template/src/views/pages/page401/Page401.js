import React from 'react'
import logo from '../../../assets/images/sanima-logo.svg'

import CIcon from '@coreui/icons-react'

const Page404 = () => {

  return (
    <div className="container-fluid" style={{ marginTop: "8%" }}>
      <div className="row justify-content-center">
        <div className="col-sm-12 text-center">
          <img src={logo} className="logo-404" alt="Sanima-Bank-Logo"/>
        </div>
        <div className="col-sm-6">
          <div className="text-center">
            <h1 className="mt-4">401</h1>
            <h4 className="p-1">Not authorized. <CIcon name="cil-lock-locked"/></h4>
            <p className="text-muted">You are requesting an unauthorized page.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page404
