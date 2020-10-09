import React from 'react';
import { connect } from 'react-redux';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import BaseCellContent from '../../CalendarPage/components/BaseCellContent';
import { access } from '../../_helpers/access';

const Dustbin = ({ time, staffKey, selectedDaysKey, isStartMovingVisit, addVisit, moveVisit }) => {
  const wrapperClick = isStartMovingVisit ? moveVisit : addVisit;

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.APPOINTMENT,
    drop: () => ({ time, staffKey, selectedDaysKey }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let border = '';
  if (isActive) {
    border = '1px solid #ed1b24';
  } else if (canDrop) {
    // border = '1px solid rgba(0, 0, 0, 0.2)'
  }
  return (
    <div
      className={`cell cell-height col-tab${(isStartMovingVisit ? ' start-moving ' : '')}`}
      onClick={wrapperClick}
      data-toggle={isStartMovingVisit && 'modal'}
      data-target={isStartMovingVisit && '.move-visit-modal'}
      ref={drop}
      style={{ border }}
    >
      <BaseCellContent time={time} notExpired/>
    </div>
  );
};

function mapStateToProps(state) {
  const {
    appointment: {
      isStartMovingVisit,
    },
  } = state;

  return {
    isStartMovingVisit,
  };
}

export default connect(mapStateToProps)(Dustbin);
