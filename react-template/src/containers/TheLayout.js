import React from 'react';
// import { IsAllowed } from './_nav';

import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

const TheLayout = (props) => {
  // var path = props.location.pathname;
  // var allowedStatus = IsAllowed(path);

  // if(!allowedStatus){
  //   props.history.push('/dashboard');
  //   return false;
  // }

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
