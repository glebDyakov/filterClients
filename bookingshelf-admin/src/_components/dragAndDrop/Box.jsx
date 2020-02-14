import React from 'react'
import { connect } from 'react-redux';
import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'
import {appointmentActions} from "../../_actions";

const Box = ({
    appointmentId,
    draggingAppointmentId,
    dispatch,
    appointments,
    timetable,
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
            if (item && dropResult) {
                dispatch(appointmentActions.makeMovingVisitQuery({
                    appointments,
                    timetable,
                    movingVisit,
                    movingVisitDuration,
                    movingVisitStaffId: dropResult.movingVisitStaffId,
                    movingVisitMillis: dropResult.movingVisitMillis,
                    prevVisitStaffId
                }))
            }
            dispatch(appointmentActions.togglePayload({ draggingAppointmentId: false }))


        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }
        ),
    })
    const visibility = (isDragging || (!draggingAppointmentId && (movingVisit && movingVisit.appointmentId) === appointmentId)) ? 'hidden' : 'visible'
    return (
        <div ref={drag} className={wrapperClassName} style={{ visibility }}>{content}</div>
    )
}

function mapStateToProps(state) {
    const {
        staff: { timetable },
        appointment: {
            movingVisit, movingVisitDuration, prevVisitStaffId, draggingAppointmentId
        }
    } = state;

    return {
        timetable, movingVisit, movingVisitDuration, prevVisitStaffId, draggingAppointmentId
    }
}

export default connect(mapStateToProps)(Box);
