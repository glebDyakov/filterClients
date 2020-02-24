import React from 'react'
import { connect } from 'react-redux';
import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'
import {appointmentActions} from "../../_actions";

const Box = ({
    moveVisit,
    appointmentId,
    draggingAppointmentId,
    dispatch,
    movingVisit,
    movingVisitDuration,
    prevVisitStaffId,
    content,
    wrapperClassName,
    startMoving
}) => {
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: ItemTypes.APPOINTMENT },
        begin: startMoving,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            let payload = {}
            if (item && dropResult) {
                payload = {
                    moveVisit,
                    movingVisitDuration,
                    prevVisitStaffId,
                    staffKey: dropResult.staffKey,
                    selectedDaysKey: dropResult.selectedDaysKey,
                    time: dropResult.time
                }
                $('.move-visit-modal').modal('show');
            } else {
                payload = { isStartMovingVisit: false, movingVisit: null, movingVisitDuration: null, prevVisitStaffId: null }
            }
            dispatch(appointmentActions.togglePayload({ draggingAppointmentId: false, ...payload }))
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }
        ),
    })
    const visibility = (isDragging || (!draggingAppointmentId && (movingVisit && movingVisit.appointmentId) === appointmentId)) ? 'hidden' : 'visible';
    return (
        <div ref={drag} className={wrapperClassName} style={{ visibility }}>{content}</div>
    )
}

function mapStateToProps(state) {
    const {
        appointment: {
            movingVisit, movingVisitDuration, prevVisitStaffId, draggingAppointmentId
        }
    } = state;

    return {
        movingVisit, movingVisitDuration, prevVisitStaffId, draggingAppointmentId
    }
}

export default connect(mapStateToProps)(Box);
