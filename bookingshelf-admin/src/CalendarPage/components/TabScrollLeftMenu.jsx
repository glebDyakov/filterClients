import React from 'react';

const TabScrollLeftMenu = (props) => (
    <div className={`cell expired`}>
        <div className={'cell hours' + (props.time.split(':')[1] === '00' ? '' : ' minutes')}>
            <span>{props.time}</span>
        </div>
    </div>
);

export default React.memo(TabScrollLeftMenu);
