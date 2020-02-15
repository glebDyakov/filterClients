import React from 'react';

const ExpiredCell = (props) => {
    const {
        content,
        wrapperId,
        wrapperClassName,
    } = props;

    return (<div id={wrapperId} className={wrapperClassName}>{content}</div>);
}
export default ExpiredCell;