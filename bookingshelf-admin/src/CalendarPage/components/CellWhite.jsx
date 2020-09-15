import React from 'react';
import Dustbin from '../../_components/dragAndDrop/Dustbin';

const CellWhite = (props) => {
  const {
    time,
    staffKey,
    selectedDaysKey,
    addVisit,
    moveVisit,
  } = props;

  return (
    <Dustbin
      time={time}
      staffKey={staffKey}
      selectedDaysKey={selectedDaysKey}
      addVisit={addVisit}
      moveVisit={moveVisit}
    />
  );
};
export default CellWhite;
