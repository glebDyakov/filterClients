import React from 'react';

import CellEmptyContent from './CellEmptyContent';

const CellExpired = (props) => {
  const { time } = props;

  return (
    <div className="cell cell-height col-tab expired">
      <CellEmptyContent time={time} />
    </div>
  );
};
export default CellExpired;
