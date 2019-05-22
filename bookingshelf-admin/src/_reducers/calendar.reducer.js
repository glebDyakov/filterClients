import {calendarConstants} from '../_constants';

export function calendar(state = {}, action) {
    switch (action.type) {
        case calendarConstants.ADD_APPOINTMENT_REQUEST:
            return {
                ...state,
                status: 208,
                adding: true
            };
        case calendarConstants.ADD_APPOINTMENT_SUCCESS:

            let appointments = state.appointments;
            if (appointments) {
                let boolAppointments = appointments.filter((app, key) =>
                    action.appointment.filter(item => app.staff.staffId === action.staffId && app['appointments'].push(item))
                );

                if (boolAppointments.length !== 0) {
                } else {
                    action.appointment.forEach(item => appointments.push({'staff': {'staffId': action.staffId}, 'appointments': [item]}))
                }
            } else {
                appointments = action.appointment.map(item => ({'staff': {'staffId': action.staffId}, 'appointments': [item]}))
            }
            return {
                ...state,
                status: 200,
                appointments: appointments,
                adding: false
            };
        case calendarConstants.ADD_APPOINTMENT_SUCCESS_TIME:
            $('.new_appointment').modal('hide')

            return {
                ...state,
                status: 209
            };
        case calendarConstants.ADD_RESERVED_TIME_REQUEST:
            return {
                ...state,
                status: 208,
                adding: true
            };
        case calendarConstants.ADD_RESERVED_TIME_SUCCESS:

            let reservedTimes = state.reservedTime;
            if (reservedTimes) {
                let boolReservedTimes = reservedTimes.filter((app, key) =>
                    app.staff.staffId === action.staffId && app['reservedTimes'].push(action.reservedTime)
                );

                if (boolReservedTimes.length !== 0) {
                } else {
                    reservedTimes.push({'staff': {'staffId': action.staffId}, 'reservedTimes': [action.reservedTime]})
                }
            } else {
                reservedTimes = [{'staff': {'staffId': action.staffId}, 'reservedTimes': [action.reservedTime]}];
            }

            return {
                ...state,
                status: 200,
                reservedTime: reservedTimes,
                adding: false

            };
        case calendarConstants.ADD_RESERVED_TIME_SUCCESS_TIME:
            setTimeout(()=>$('.modal_calendar').modal('hide'), 100)

            return {
                ...state,
                status: 209
            }
        case calendarConstants.EDIT_APPOINTMENT_SUCCESS:

            let appointmentsLoaded = state.appointments;

            appointmentsLoaded.map((app, key1) =>
                app.staff.staffId === action.appointment.staffId && app['appointments'].map((appointments, key2) => {
                    if (appointments.appointmentId === action.appointment.appointmentId) {
                        appointmentsLoaded[key1]['appointments'][key2] = action.appointment
                    }
                })
            );

            return {
                ...state,
                status: 200,
                appointments: appointmentsLoaded
            };
        case calendarConstants.APPROVE_APPOINTMENT_SUCCESS:

            let appointmentsApproved = state.appointments;
            appointmentsApproved.map((app, key1) =>
                app['appointments'].map((appointments, key2) => {
                    if (appointments.appointmentId === action.id) {
                        appointmentsApproved[key1]['appointments'][key2].approved = true
                    }
                })
            );

            return {
                ...state,
                status: 200,
                appointments: appointmentsApproved
            };
        case calendarConstants.APPROVE_APPOINTMENT_SUCCESS:

            // let appointmentsApproved = state.appointments;
            // appointmentsApproved.map((app, key1) =>
            //     app['appointments'].map((appointments, key2) => {
            //         if (appointments.appointmentId === action.id) {
            //             appointmentsApproved[key1]['appointments'][key2].approved = true
            //         }
            //     })
            // );
            //
            // return {
            //     ...state,
            //     status: 200,
            //     appointments: appointmentsApproved
            // };

            return {
                ...state
            }

        case calendarConstants.SET_SCROLLABLE_APPOINTMENT:
            return {
                ...state,
                scrollableAppointmentId: action.id
            }
        case calendarConstants.DELETE_APPOINTMENT_SUCCESS:
            const appointmentsDeleted = state.appointments;

            appointmentsDeleted.map((app, key1) =>
                app['appointments'].map((appointments, key2) => {
                    if (appointments.appointmentId === action.id) {
                        appointmentsDeleted[key1]['appointments'].splice(key2, 1)
                    }
                })
            );

            return {
                ...state,
                appointments: appointmentsDeleted
            };
        case calendarConstants.DELETE_RESERVED_TIME_SUCCESS:
            const reservedDeleted = state.reservedTime;

            reservedDeleted.map((app, key1) =>
                app['reservedTimes'].map((reservedTime, key2) => {
                    if (reservedTime.reservedTimeId === action.reservedTimeId) {
                        reservedDeleted[key1]['reservedTimes'].splice(key2, 1)
                    }
                })
            );

            return {
                ...state,
                reservedTime: reservedDeleted
            };
        case calendarConstants.ADD_APPOINTMENT_FAILURE:
            return {...state};
        case calendarConstants.EDIT_APPOINTMENT_FAILURE:
            return {...state};
        case calendarConstants.APPROVE_APPOINTMENT_FAILURE:
            return {...state};
        case calendarConstants.DELETE_APPOINTMENT_FAILURE:
            return {...state};
        case calendarConstants.GET_APPOINTMENT_SUCCESS:
            return {
                ...state,
                appointments: action.appointments
            };
        case calendarConstants.GET_APPOINTMENT_SUCCESS_COUNT:
            return {
                ...state,
                appointmentsCount: action.appointments
            };

        case calendarConstants.GET_APPOINTMENT_SUCCESS_CANCELED:
            return {
                ...state,
                appointmentsCanceled: action.appointments
            };
        case calendarConstants.GET_RESERVED_TIME_SUCCESS:
            return {
                ...state,
                reservedTime: action.reservedTime
            };
        default:
            return state
    }
}