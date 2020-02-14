import React from 'react';
import { connect } from 'react-redux';
import { appointmentActions, calendarActions } from "../../_actions";

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
        const { changingVisit, currentTarget, changingPos, offsetHeight, minTextAreaHeight } = this.props;
        const textAreaWrapper = `${changingVisit.appointmentId}-textarea-wrapper`
        const node = document.getElementById(textAreaWrapper)

        // 'res' = начальная высота div'a + кол-во пикселов смещения
        const res = offsetHeight + e.pageY - changingPos;
        if (res > minTextAreaHeight) {
            node.style.height = res + "px";
            currentTarget.style.bottom = -res + "px";
        }
    }

    handleMouseUp() {
        const { appointments, changingVisit, offsetHeight } = this.props;
        const textAreaWrapper = `${changingVisit.appointmentId}-textarea-wrapper`
        const newOffsetHeight = document.getElementById(textAreaWrapper).offsetHeight
        const offsetDifference = Math.round((newOffsetHeight - offsetHeight) / 20)

        let newDuration = (15 * 60 * offsetDifference)
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

        this.props.dispatch(appointmentActions.togglePayload({
            changingVisit: null,
            currentTarget: null,
            changingPos:null,
            offsetHeight: null,
            minTextAreaHeight: null
        }));
    }

    render() {
        return null
    }
}

function mapStateToProps(state) {
    const {
        appointment: {
            changingVisit, currentTarget, changingPos, offsetHeight, minTextAreaHeight
        }
    } = state;

    return {
        changingVisit, currentTarget, changingPos, offsetHeight, minTextAreaHeight
    }
}

export default connect(mapStateToProps)(DragVertController);
