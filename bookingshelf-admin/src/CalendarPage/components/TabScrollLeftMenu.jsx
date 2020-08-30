import React from 'react';

const TabScrollLeftMenu = (props) => (
  <div className={`cell cell-height expired left-menu-item`}>
    <div className={'cell hours red-line-marker' + (props.time.split(':')[1] === '00' ? '' : ' minutes')}>
      <span>{props.time}</span>
    </div>
    <div className="fon-for-red"></div>
  </div>
);

export default React.memo(TabScrollLeftMenu);
