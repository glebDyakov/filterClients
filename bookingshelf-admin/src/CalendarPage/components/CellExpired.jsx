import React from 'react';

const CellExpired = (props) => {
    const {
        content,
        wrapperClassName,
    } = props;

    return (<div className={wrapperClassName}>{content}</div>);
}
export default CellExpired;