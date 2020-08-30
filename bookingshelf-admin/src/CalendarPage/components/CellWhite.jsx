import React from 'react';
import Dustbin from '../../_components/dragAndDrop/Dustbin';

const CellWhite = (props) => {
  const {
    time,
    content,
    staffKey,
    selectedDaysKey,
    wrapperClassName,
    addVisit,
    moveVisit,
  } = props;

  return (
    <Dustbin
      time={time}
      staffKey={staffKey}
      selectedDaysKey={selectedDaysKey}
      content={content}
      wrapperClassName={wrapperClassName}
      addVisit={addVisit}
      moveVisit={moveVisit}
    />
  );
};
export default CellWhite;
