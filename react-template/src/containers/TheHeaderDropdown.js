import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Logout, getProfilePhoto } from '../services/Services'
import { NavLink } from 'react-router-dom';

const TheHeaderDropdown = () => {
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <img
            src={getProfilePhoto()}
            onError={(e)=>{e.target.onerror = null; e.target.src='avatars/default-user.jpg'}}
            className="c-avatar-img"
            alt="default-user"
          />
          
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Settings</strong>
        </CDropdownItem>
        <NavLink to="/profile" className="dropdown-item" role="menuitem"><CIcon className="mr-2" name="cil-user"/> Profile </NavLink>
        <CDropdownItem divider />
        <NavLink to="/" className="dropdown-item" onClick={() => Logout()} role="menuitem"><CIcon className="mr-2" name="cil-lock-locked"/> Sign Out </NavLink>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
