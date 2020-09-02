import React from 'react';

import BaseCellContent from './BaseCellContent';

const CellExpired = (props) => {
  const { time } = props;

  return (
    <div className="cell cell-height col-tab expired">
      <BaseCellContent time={time} />
    </div>
  );
};
export default CellExpired;
