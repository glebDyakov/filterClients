import React from 'react';
import { connect } from 'react-redux';
import { appointmentActions, calendarActions } from "../../_actions";
import {isAvailableTime} from "../../_helpers/available-time";

class DragVertController extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    componentWillReceiveProps(newProps) {
        if (newProps.changingVisit) {
            document.addEventListener('mousemove', this.handleMouseMove, false);
            document.addEventListener('mouseup', this.handleMouseUp, false);
        } else {
            document.removeEventListener('mousemove', this.handleMouseMove, false);
            document.removeEventListener('mouseup', this.handleMouseUp, false);
        }
    }

    handleMouseMove(e) {
        const { currentTarget, changingPos, offsetHeight, minTextAreaHeight, textAreaId } = this.props;
        const node = document.getElementById(textAreaId)

        // 'res' = начальная высота div'a + кол-во пикселов смещения
        const res = offsetHeight + e.pageY - changingPos;
        if (res > minTextAreaHeight) {
            node.style.height = res + "px";
            currentTarget.style.bottom = -res + "px";
        }
    }

    handleMouseUp() {
        const { appointments, reservedTime, timetable, changingVisit, offsetHeight, textAreaId } = this.props;
        const newOffsetHeight = document.getElementById(textAreaId).offsetHeight
        const offsetDifference = Math.round((newOffsetHeight - offsetHeight) / 20)

        let newDuration = (15 * 60 * offsetDifference)

        let currentTotalDuration = changingVisit.duration
        if (changingVisit.hasCoAppointments) {
            appointments.map((staffAppointment) => {
                staffAppointment.appointments.forEach(appointment => {
                    if (appointment.coAppointmentId === changingVisit.appointmentId) {
                        currentTotalDuration += appointment.duration
                    }
                })
            })
        }

        const startTime = changingVisit.appointmentTimeMillis;
        const endTime = changingVisit.appointmentTimeMillis + ((currentTotalDuration + newDuration) * 1000);

        const staffWithTimetable = timetable && timetable.find(item => item.staffId === changingVisit.staffId)

        const isOwnInterval = i => changingVisit.appointmentTimeMillis <= i && (changingVisit.appointmentTimeMillis + (currentTotalDuration * 1000)) > i

        let shouldDrag = isAvailableTime(startTime, endTime, staffWithTimetable, appointments, reservedTime, isOwnInterval)
        if (shouldDrag) {
            if (changingVisit.hasCoAppointments) {
                const coAppointments = []
                appointments.map((staffAppointment) => {

                    staffAppointment.appointments.sort((b, a) => a.appointmentId - b.appointmentId).forEach(appointment => {
                        if (appointment.coAppointmentId === changingVisit.appointmentId) {
                            coAppointments.push(appointment)
                        }
                    })
                })
                coAppointments.push(changingVisit)

                let shouldUpdateDuration = true
                if (newDuration > 0) {
                    this.props.dispatch(calendarActions.updateAppointment(
                        changingVisit.appointmentId,
                        JSON.stringify({ duration: changingVisit.duration + newDuration }),
                        false,
                        true
                    ))
                } else {
                    let timeout = 0;
                    coAppointments.forEach(coAppointment => {
                        if (shouldUpdateDuration) {
                            newDuration = coAppointment.duration + newDuration
                            if (newDuration > 900) {
                                shouldUpdateDuration = false
                                setTimeout(() => {
                                    this.props.dispatch(calendarActions.updateAppointment(
                                        coAppointment.appointmentId,
                                        JSON.stringify({duration: newDuration}),
                                        false,
                                        true
                                    ))
                                }, 1000 * timeout)
                            } else {
                                newDuration-=900

                                setTimeout(() => {
                                    this.props.dispatch(calendarActions.updateAppointment(
                                        coAppointment.appointmentId,
                                        JSON.stringify({duration: 900}),
                                        false,
                                        true
                                    ))
                                }, 1000 * timeout)
                                timeout++;
                            }
                        }
                    })
                }
            } else {
                this.props.dispatch(calendarActions.updateAppointment(
                    changingVisit.appointmentId,
                    JSON.stringify({ duration: changingVisit.duration + newDuration }),
                    false,
                    true
                ))
            }
        }

        this.props.dispatch(appointmentActions.togglePayload({
            changingVisit: null,
            currentTarget: null,
            changingPos:null,
            offsetHeight: null,
            minTextAreaHeight: null,
            textAreaId: null
        }));
    }

    render() {
        return null
    }
}

function mapStateToProps(state) {
    const {
        calendar: { appointments, reservedTime },
        staff: { timetable },
        appointment: {
            changingVisit, currentTarget, changingPos, offsetHeight, minTextAreaHeight, textAreaId
        }
    } = state;

    return {
        appointments, reservedTime, timetable, changingVisit, currentTarget, changingPos, offsetHeight, minTextAreaHeight, textAreaId
    }
}

export default connect(mapStateToProps)(DragVertController);
